const Sofia = require("./../scripts/sofia");


class Zombie{

  respond(regex, callback){

  }
  hear(regex ,callback ){
    this.callback = callback;
  }

}

describe("Tests for Hubot",()=>{
  "use strict";
  beforeEach(()=>{
    this.zombie = new Zombie();
    this.robot = Sofia(this.zombie);
  });

  it("Should forward all input", ()=>{
    return new Promise((resolve,reject)=>{
      this.zombie.send = (msg)=> {
        console.log(msg)
        if(msg != "Oh we got a problem here.... "){
          reject(msg  + "=> dose not match the expected msg")
        }else {
          resolve()
        }
      };
      this.zombie.callback()
    });

  });
  afterEach(()=>{
    delete this.robot;
    delete this.zombie;
  })

});