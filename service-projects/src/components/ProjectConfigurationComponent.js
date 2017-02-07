let util = require("util");
let debug = require("debug")("sofia");
let getChannelIdFromEvent = require("./../utils").getChannelIdFromEvent;
let getSchemaTypeFromEvent = require("./../utils").getSchemaTypeFromEvent;
let fs = require("fs-extra");
let uuid = require("uuid");
let simpleGit = require('simple-git');
class ContextComponent {

  constructor(){
    this.projects = {};
  }

  getProjectForChannel(channelId){
    this.projects[channelId] = this.projects[channelId] ? this.projects[channelId] : null;
    return this.projects[channelId];
  }

  sendText(text,channelId){
    let topic = util.format('sofia.channel.%s.messages.OutgoingSentence',channelId);
    debug(util.format("Send text %s to topic %s ",text, topic));
    this.session.publish(topic,[{text: text, channel: channelId}]);

  }
  askString(question, channelId){
    let topic = util.format('sofia.channel.%s.rpc.service-question.askString',channelId);
    return this.session.call(topic, [{question: question}])
  }
  onRequestProjectConfig(msg,obj,event){
    debug("Got Request for project configuration");
    let channel_id = getChannelIdFromEvent(event);
    let self = this;
    //Ask the user for project url
    this.askForRepositoryUrl(channel_id).then((repositoryUrl)=>{
      self.sendText("Yeeah", channel_id)
    }).catch((repositoryUrl)=>{
      self.sendText("I got some trouble to connect to your repository ("+repositoryUrl+").", channel_id);
      this.askForRepositoryUrl(channel_id).then((repositoryUrl)=>{
        self.sendText("Okay now I got it",channel_id)
      }).catch((repositoryUrl)=>{
        self.sendText("I can't connect to the repository: " + repositoryUrl + " \n Just come back if you have the right url", channel_id)
      })
    })

  }
  askForRepositoryUrl(channelId){
    debug("askForRepositoryUrl");
    let project_url_promise = this.askString("Please enter your project git url like. \n For example'git@github.com:B-Stefan/Sofia.git'", channelId);
    return project_url_promise.then((repositoryUrl)=>{
      return this.tryFetchRepositoryUrl(repositoryUrl)
    })
  }
  tryFetchRepositoryUrl(reproUrl){
    return new Promise((resolve,reject)=>{
      debug("Repro url", reproUrl);
      let tmp_folder = __dirname + "/" +  uuid.v4();
      debug("Folder", tmp_folder);
      fs.mkdir(tmp_folder, (err)=>{
        if (err) throw Error(err);
        debug("create git", tmp_folder);
        simpleGit(tmp_folder)
            .init()
            .addRemote('origin', reproUrl)
            .fetch("origin", "master", (err, fetchSummary)=>{
              console.log("Errors",err, typeof err, typeof fetchSummary);
              if(typeof err == "string" || typeof fetchSummary == "undefined"){
                reject(reproUrl)
              }else {
                resolve(reproUrl)
              }
              // remove temp dict
              fs.remove(tmp_folder)
            });
      });
    });

  }
  onAuthRequested(){

  }

  onRepositoryUrl(msg,obj,event){
    debug("got project");
    let repositoryUrl= msg[0].repositoryUrl;
    let channelId = getChannelIdFromEvent(event);
    let storedProjectInformation = this.getProjectForChannel(channelId);
    if (storedProjectInformation == null){
      this.sendText(util.format("Okay I will look for your repository at %s and try to configure this channel", repositoryUrl))
    }else {
      this.sendText(util.format("It seams that you send a repository url to this channel, should I reconfigure this channel to the repro at %s?", repositoryUrl))
    }
  }

  onJoin(session){
    let promiseArr = [];
    this.session = session;

    promiseArr.push(session.subscribe("sofia.channel..messages.RequestProjectConfig",this.onRequestProjectConfig.bind(this),{ match: "wildcard" }));
    promiseArr.push(session.subscribe("sofia.channel.1000.messages.test",()=>{
      debug("Yeeeah")
    },{ match: "wildcard" }));
    return Promise.all(promiseArr);
  }
}
module.exports = ContextComponent ;