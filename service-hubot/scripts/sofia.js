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

var router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL : "ws://wamp_router:8080/ws";

var router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM : "realm1";

var env = process.env.env ? process.env.env.toUpperCase() : "production";

module.exports = function (robot) {
    console.log("Verson 2   ");

    var session = undefined;

    var connection = new autobahn.Connection({
            url: router_url,
            realm: router_realm
        }
    );
    console.log("Try to connect to wamp router: " + router_url + " R: " + router_realm)
    connection.onopen = function (sess) {
        console.log("Connection is open to ", router_url, router_realm);
        session = sess;
        session.subscribe('sofia.channel..messages.OUTGOING_MESSAGE', function (args, obj, event) {
            console.log(arguments);
            var msg = args[0];
            console.log("Got outgoing msg for channel " + msg.channel + " and msg: " + msg.text);
            console.log(robot.adapter.chatdriver)
            robot.adapter.chatdriver.getRoomId(msg.channel).then(function(roomId){
                "use strict";
                console.log("room id " + roomId)
            });
            robot.adapter.chatdriver.sendMessageByRoomId({msg: msg.text}, msg.channel).catch()
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

    robot.respond(/meow/i, function (res) {
        res.send("Mew mew mew~");
    });

    robot.hear(/.*/, function (res) {
        if (session == undefined) {
            robot.send("Oh we got a problem here.... ");
            robot.send("I can't forward your message because we got a connection problem to the router: " + router_url + " realm:" + router_realm)
            return
        }
        var topic = 'sofia.channel.' + res.message.room.toLowerCase() + '.messages.INCOMING_MESSAGE';
        console.log("Forward  message to " + topic);
        console.log(res);
        session.publish(topic, [res.message]);
        console.log("Published.... ");

    })
};
