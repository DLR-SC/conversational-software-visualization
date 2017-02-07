
module.exports.connectToServer = function(url,relam,sessionFn){
  return new Promise((resolve,reject)=>{
    console.info("Try to connect to ", url, relam);
    let connection = new autobahn.Connection({
      url: url,
      realm: relam}
    );
    connection.onopen = function (session) {
      console.info("Connection is open to ", url, relam);
      resolve(connection);
      sessionFn(session)
    };
    connection.onclose = function (reason, details) {
      if (reason == "unreachable" || reason == "unsupported"){
        console.info("Connection not established", reason, details);
        reject(reason);
      }else {
        console.info("Connection error", reason, details);
      }
    };
    connection.open()

  })
};
/**
 * Transform  sofia.session.1000.messages.PROJECT into 1000
 * @param events
 * @returns {*}
 */
module.exports.getChannelIdFromEvent = function(event){
  "use strict";
  let topic = event.topic ?  event.topic: event.procedure;
  return topic.split(".").reduce((accumulator,current,currentIndex,array)=>{
    if (current == "channel"){
      return array[currentIndex+1];
    }
    return accumulator
  })
};
/**
 *  Transform  sofia.session.1000.messages.PROJECT into PROJECT
 * @param event
 * @returns {*}
 */
module.exports.getSchemaTypeFromEvent = function (event) {
  let topic = event.topic ?  event.topic: event.procedure;
  return topic.split(".").reduce((accumulator,current,currentIndex,array)=>{
    if (current == "messages" || current == "rpc"){
      return array[currentIndex+1];
    }
    return accumulator
  })
};