let autobahn = require("autobahn");
let debug = require("debug")("sofia");

module.exports.connectToServer = function(url,relam,sessionFn){

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
