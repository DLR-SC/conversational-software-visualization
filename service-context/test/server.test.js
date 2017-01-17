let chai = require('chai');
let expect = chai.expect; // we are using the "expect" style of Chai
let Server = require('./../src/server').Server;
let ArgumentException = require('./../src/server').ArgumentException;
let connectToServer = require('./../src/utils').connectToServer;
let debug = require("debug")("sofia");

let router_url = process.env.WAMP_ROUTER_URL ? process.env.WAMP_ROUTER_URL :  "ws://wamp_router:8080/ws" ;

let router_realm = process.env.WAMP_RELAM ? process.env.WAMP_RELAM :  "realm1";

describe('Connect to Router', function() {

  it('Server constructor should throw error if you pass the wrong arguments', function() {

        //Wrap the new constructor into a function, required by test framework mocha
        function newServerWrapper(arg1,arg2){
          return ()=>{
            return new Server(arg1,arg2)
          }
        }

        expect(newServerWrapper(null,null)).to.throw(ArgumentException);
        expect(newServerWrapper("",null)).to.throw(ArgumentException);
        expect(newServerWrapper(null,"")).to.throw(ArgumentException);
        expect(newServerWrapper("","")).to.not.throw(ArgumentException)
  });

  it('_connect should connect to the server', function() {
    let server = new Server(router_url,router_realm);
    expect(server._connect()).to.be.an.instanceof(Promise);

  });
});

function startServer() {
  let server = new Server(router_url, router_realm);
  server.start();
}
describe("Ask questions should emit events", function () {

  before(function(){
    return startServer()
  });

  it('"Wo finde ich Klasse xyz " should emit the event DISPLAY_CLASS', function () {

    return new Promise((resolve,reject)=>{

        function setupSession(session){

            function onMessage(args){
              let msg = args[0];

              if(msg.className == "xyz"){
              debug("got right event:", msg);
                resolve(msg)
              }

            }
            session.subscribe('sofia.messages.DISPLAY_CLASS', onMessage).then(()=> {

              session.publish('sofia.messages.SENTENCE', ["Wo finde ich Klasse xyz"])

            }).catch(reject);

        }
        connectToServer(router_url,router_realm, setupSession).catch(reject);

       })

  });

});
