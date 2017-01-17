let autobahn = require('autobahn');
let connectToServer = require("./utils").connectToServer;
let debug = require("debug")("sofia");
class ArgumentException extends Error{

}

class Server {

  constructor(wamp_router_url, realm){

    if(wamp_router_url == null || wamp_router_url == undefined || typeof wamp_router_url != "string"){
      throw  new ArgumentException("Argument: wamp_router_url  should be a proper url like: http://localhost:333/ws")
    }
    if(realm == null || realm == undefined || typeof realm != "string"){
      throw  new ArgumentException("Argument: realm  should be a simple string like 'relam1' ")
    }
    this.connection = null;
    this.router_realm = realm;
    this.router_url = wamp_router_url;
  }

  _connect(setupSessionFn){

    if(this.connection != null) {
      throw new Error("Connection is already established");
    }

    return connectToServer(this.router_url,this.router_realm,setupSessionFn).then((connection)=>{
      this.connection = connection;
      return connection;
    });

  }
  sayHello(){

  }

  start(){
    return this._connect((session) => {

      // SUBSCRIBE to a topic and receive events
      //
      function onSentence (args) {
        let sentence = args[0];

        if(sentence == "Wo finde ich Klasse xyz"){
          debug("Got event DISPLAY_CLASS");
          session.publish('sofia.messages.DISPLAY_CLASS', [{className: 'xyz'}])
        }
      }
      session.subscribe('sofia.messages.SENTENCE', onSentence).then(
          function (sub) {
            debug("subscribed to topic 'onhello'");
          },
          function (err) {
            debug("failed to subscribed: " + err);
          }
      );

    });

  }
}

//Export the modules in ES5 way because current Node.js version don't support the ES6 export syntax
module.exports.Server = Server;
module.exports.ArgumentException = ArgumentException;
