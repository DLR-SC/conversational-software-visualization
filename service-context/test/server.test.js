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
  return server.start();
}
describe("Ask questions should emit events", function () {

  before(function(){
    return startServer()
  });

  it('"Should store the project confiuration', function () {

    let testContextInformation = {repository:"test"};
    return new Promise((resolve,reject)=>{

        function setupSession(session){
            debug("Publish project configuration");
            session.publish('sofia.channel.1000.messages.PROJECT.v-0-0-1', [testContextInformation]);
            debug("Try to rpc");
            session.call('sofia.channel.1000.rpc.PROJECT.getContext').then((projectContext)=>{
              debug("Got result from RPC call", projectContext);
              chai.expect(JSON.stringify(projectContext)).to.be.equal(JSON.stringify(testContextInformation));
              resolve()

            }).catch(reject)


        }
        connectToServer(router_url,router_realm, setupSession).catch(reject);

       })

  });

});
