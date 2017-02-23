// Description:
//   This bot listen to every word and forward the data to a wamp channel
//
// Dependencies:
//   http://autobahn.ws
//
// Configuration:
//   None
//
// Commands:
//   hubot meow - < Sends you feline talk. >
//
// Notes:
//   Version 1.0
//
// Author:
//   B-Stefan

const autobahn = require("autobahn");

const debug = require("debug")("sofia");

const router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL : "ws://wamp_router:8080/ws";

const router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM : "realm1";

const env = process.env.env ? process.env.env.toUpperCase() : "production";

/**
 * Method to connect to the wamp router
 * @param url - the router url
 * @param relam - the relam
 * @param sessionFn - callback function for a successful join
 * @returns {Promise}
 */
const connectToServer = function(url,relam,sessionFn){

  return new Promise((resolve,reject)=>{
    debug("Try to connect to ", url, relam);
    let connection = new autobahn.Connection({
      url: url,
      realm: relam}
    );
    connection.onopen = function (session) {
      debug("Connection is open to ", url, relam);
      resolve(connection);
      sessionFn(session)
    };
    connection.onclose = function (reason, details) {
      if (reason == "unreachable" || reason == "unsupported"){
        debug("Connection not established", reason, details);
        reject(reason);
      }else {
        debug("Connection error", reason, details);
      }
    };
    connection.open()

  })
};

/**
 * Hubot script
 * @param robot
 */
module.exports = function (robot) {

  let session;

  let connection = new autobahn.Connection({
        url: router_url,
        realm: router_realm
      }
  );

  const onJoin = function(sess) {
    session = sess;
    session.subscribe('sofia.channel..messages.OutgoingSentence', function (args, obj, event) {

      let msg = args[0];

      debug("Got outgoing msg for channel " + msg.channel + " and msg: " + msg.text);

      robot.adapter.chatdriver.sendMessageByRoomId(msg.text, msg.channel)
          .then(function () {
            debug("Message sent")
          }).catch(function (err) {
        debug(err)
      });

    }, {match: "wildcard"});
  };

  /**
   * Try to connect to WAMP Router
   */
  debug("Try to connect to wamp router: " + router_url + " R: " + router_realm);
  connectToServer(router_url,router_realm,onJoin.bind(this)).then(()=>{
    "use strict";
    debug("connected succesful to wamp router " + router_url + " " + router_realm)
  }).catch((err)=>{
    "use strict";
    debug("Failed to connect to wamp router : " + router_realm + " " + router_realm + " with error ", err)
  });


  /**
   * Add listener for the robot
   */

  robot.hear(/.*/, function (res) {
    debug("Got message from brain");
    if (typeof session === "undefined") {
      debug("Send msg that we got an connection problen");
      robot.send("Oh we got a problem here.... ");
      robot.send("I can't forward your message because we got a connection problem to the router: " + router_url + " realm:" + router_realm)
      connection.open();
      return
    }
    let topic = 'sofia.channel.' + res.message.room + '.messages.IncomingSentence';
    debug("Forward  message to " + topic);
    debug(res);

    let mention = false;
    let text = res.message.text;
    if (text.toLowerCase().indexOf("@sofia") == 0){
      mention = true;
      //Remove mention "@sofia" from text
      text = text.split(" ").slice(1).join(" ")
    }
    let payload = {
      text: text,
      userName: res.message.user.name,
      mention: mention
    };

    session.publish(topic, [payload]);

    debug("Published msg .... " + JSON.stringify(payload));

  })
};
