let Server = require("./server").Server;
let debug  = require("debug")("sofia");

let router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL :  "ws://wamp_router:8080/ws" ;

let router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM :  "realm1";

//Create new server instance and start the server

let server = new Server(router_url, router_realm);

server.start().then((connection)=>{
    debug("Connection to router established \n server is ready")

}).catch((err)=>{

  throw new Error(err)

});


module.exports = Server;