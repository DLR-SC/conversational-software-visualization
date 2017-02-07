

system.import("./src/app.js").then((App)=>{
  console.log("Yees")
  let instance = new App();
}).catch((err)=>{
  console.error("error", err);
});