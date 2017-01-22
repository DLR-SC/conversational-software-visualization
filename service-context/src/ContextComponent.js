let debug = require("debug")("ContextComponent");
let getChannelIdFromEvent = require("./utils").getChannelIdFromEvent;
let getSchemaTypeFromEvent = require("./utils").getSchemaTypeFromEvent;
class ContextComponent {

  constructor(){
    this.contextInformation = {};
  }

  onJoin(session){
    let subPromise =  session.subscribe("sofia.channel..messages..",(msg,obj,event)=>{
      let sessionId =  getChannelIdFromEvent(event);
      let schemaType =  getSchemaTypeFromEvent(event);
      let schemaData  = msg[0];
      debug("stored new project config for session "+ sessionId, schemaData);
      this.contextInformation[sessionId]  = this.contextInformation[sessionId] ?  this.contextInformation[sessionId]: {};
      this.contextInformation[sessionId][schemaType] = schemaData;

    },{ match: "wildcard" });
                                    // sofia.session.1000.rpc.PROJECT.getContext
    let rpcPromise = session.register("sofia.channel..rpc..getContext",(msg,obj,event)=>{
      let sessionId =  getChannelIdFromEvent(event);
      let schemaType =  getSchemaTypeFromEvent(event);
      this.contextInformation[sessionId]  = this.contextInformation[sessionId] ?  this.contextInformation[sessionId]: {};
      debug("Got rpc call for sessionId;" + sessionId + " ", this.contextInformation[sessionId][schemaType]);
      return this.contextInformation[sessionId][schemaType]
    },{ match: "wildcard" })


    return Promise.all([subPromise,rpcPromise]);
  }
}
module.exports = ContextComponent ;