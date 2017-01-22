let autobahn = require('autobahn');
let connectToServer = require("./utils").connectToServer;
let debug = require("debug")("sofia");
let ProjectContextComponent = require("./ContextComponent");
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
    this.components = [];
    this.initComponents();
  }

  initComponents(){
    this.components.push(new ProjectContextComponent())
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

  onJoin(session){
    return Promise.all(this.components.map((component)=>component.onJoin(session)))
        .then(()=>{debug("Joined session successful");})
        .catch(()=>{throw new Error(arguments)})
  }

  start(){

    return this._connect(this.onJoin.bind(this));

  }
}

//Export the modules in ES5 way because current Node.js version don't support the ES6 export syntax
module.exports.Server = Server;
module.exports.ArgumentException = ArgumentException;
