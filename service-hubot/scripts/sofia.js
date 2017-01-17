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
//   munroenet | Cameron Munroe ~ Mun

var autobahn = require("autobahn");

var router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL :  "ws://wamp_router:8080/ws" ;

var router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM :  "realm1";

module.exports = function(robot) {

  var session = undefined;

  var connection = new autobahn.Connection({
    url: router_url,
    realm: router_realm}
  );
  console.log("Try to connect to wamp router: " + router_url + " R: " + router_realm)
  connection.onopen = function (sess) {
    console.log("Connection is open to ", router_url, router_realm);
    session = sess;
  };
  connection.onclose = function (reason, details) {
    if (reason == "unreachable" || reason == "unsupported"){
      console.log("Connection not established", reason, details);
    }else {
      console.log("Connection lost", reason, details);
    }
  };
  connection.open();

  robot.respond(/meow/i, function(res) {
    res.send("Mew mew mew~");
  });

  robot.hear(/.*/, function (robot,msg,match,envelope) {
      if (session == undefined){
        robot.send("Oh we got a problem here.... ");
        robot.send("I can't forward your message because we got a connection problem to the router: " + router_url + " realm:" + router_realm)
        return
      }
      session.publish('sofia.messages.SENTENCE', [msg]);
  })
};
