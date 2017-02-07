
const main = require("osgi-visualization/src/bundles/main");
const metrics = require("osgi-visualization/src/bundles/metrics");
const vis = require("osgi-visualization/src/bundles/vis");
const d3 = require("osgi-visualization/lib/d3/d3");
const utils = require("./utils");
class App {

  constructor(options){

    options = options ? options : {};
    console.info("Created app")
    let osgiApiUrl = options.osgiApiUrl ? options.osgiApiUrl: "https://osgi-api.cloud.conts.de";
    let svgCanvas = options.svgCanvas  ? options.svgCanvas : d3.select("#bundles-svg");

    this.initBundleVis(osgiApiUrl,svgCanvas);


    let WAMP_ROUTER_URL = options.WAMP_ROUTER_URL ? options.WAMP_ROUTER_URL : "ws://cloud.conts.de:8090/ws";
    let WAMP_RELAM = options.WAMP_RELAM ? options.WAMP_RELAM : "realm1";

      console.log("connectWamp")
    this.connectWamp(WAMP_ROUTER_URL,WAMP_RELAM)

  }


  initBundleVis(osgiApiUrl, svgCanvas ){

    const bundlesPromise = fetch(osgiApiUrl + "/bundles?size=1000")
        .then((res)=>res.json())
        .then((data)=>data._embedded)
        .then((data)=>data.bundles);

    const ImExportsGraphPromise = fetch(osgiApiUrl+ "/graph")
        .then((res)=>res.json());

    ImExportsGraphPromise.then((data)=>console.log(data));

    return Promise.all([bundlesPromise,ImExportsGraphPromise]).then((results)=>{
      let bundles = results[0];
      let imExports = results[1];

      vis.renderBundleGraph(bundles, imExports, svgCanvas);

      /*main.useMetric(metrics.getMetric("bundles-size-metric-uniform"));
      main.useMetric(metrics.getMetric("bundles-color-metric-uniform"));
      main.useMetric(metrics.getMetric("dependencies-color-metric-uniform"));
      main.useMetric(metrics.getMetric("dependencies-width-metric-uniform"));*/
      return true
    });
  }
  connectWamp(url, relam){
     console.log(url,relam)
    return utils.connectToServer(url,relam,this.onJoin).catch(()=>console.error(arguments))
  }

  onJoin(){
      console.log("onJoin")
  }

}

module.exports = App;