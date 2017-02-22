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

var autobahn = require("autobahn");

var router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL : "ws://wamp_router:8080/ws";

var router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM : "realm1";

var env = process.env.env ? process.env.env.toUpperCase() : "production";

module.exports = function (robot) {

  var session;

  var connection = new autobahn.Connection({
        url: router_url,
        realm: router_realm
      }
  );
  /**
   * Try to connect to WAMP Router
   */
  console.log("Try to connect to wamp router: " + router_url + " R: " + router_realm)
  connection.onopen = function (sess) {
    console.log("Connection is open to ", router_url, router_realm);
    session = sess;
    session.subscribe('sofia.channel..messages.OutgoingSentence', function (args, obj, event) {

      var msg = args[0];

      console.log("Got outgoing msg for channel " + msg.channel + " and msg: " + msg.text);

      robot.adapter.chatdriver.sendMessageByRoomId(msg.text, msg.channel)
          .then(function () {
            console.log("Message sent")
          }).catch(function (err) {
            console.log(err)
      });

    }, {match: "wildcard"});
  };
  connection.onclose = function (reason, details) {
    if (reason == "unreachable" || reason == "unsupported") {
      console.log("Connection not established", reason, details);
    } else {
      console.log("Connection lost", reason, details);
    }
  };
  connection.open();


  /**
   * Add listener for the robot
   */

  robot.hear(/.*/, function (res) {
    console.log("Got message from brain");
    if (typeof session === "undefined") {
      console.log("Send msg that we got an connection problen");
      robot.send("Oh we got a problem here.... ");
      robot.send("I can't forward your message because we got a connection problem to the router: " + router_url + " realm:" + router_realm)
      connection.open();
      return
    }
    var topic = 'sofia.channel.' + res.message.room + '.messages.IncomingSentence';
    console.log("Forward  message to " + topic);
    console.log(res);

    var mention = false;
    if (res.message.toLowerCase().indexOf("@sofia") == 0){
      mention = true;
    }
    session.publish(topic, [{
      text: res.message,
      userName: res.user.name,
      mention: mention
    }]);

    console.log("Published.... ");

  })
};
