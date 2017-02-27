
const main = require("osgi-visualization/src/bundles/main");
const metrics = require("osgi-visualization/src/bundles/metrics");
const vis = require("osgi-visualization/src/bundles/vis");
const d3 = require("osgi-visualization/lib/d3/d3");
const utils = require("./utils");
/**
 * Class for the app
 */
class App {

  /**
   * Creates a new app instance
   * @param options - The svgCanvas dom object and osgiAPI url as string
   */
  constructor(options){

    options = options ? options : {};
    let osgiApiUrl = options.osgiApiUrl ? options.osgiApiUrl: "https://osgi-api.cloud.conts.de";
    let svgCanvas = options.svgCanvas  ? options.svgCanvas : d3.select("#bundles-svg");

    this.initVisPromise = this.initBundleVis(osgiApiUrl,svgCanvas);


    let WAMP_ROUTER_URL = options.WAMP_ROUTER_URL ? options.WAMP_ROUTER_URL : "ws://cloud.conts.de:8090/ws";
    let WAMP_RELAM = options.WAMP_RELAM ? options.WAMP_RELAM : "realm1";

    this.connectWamp(WAMP_ROUTER_URL,WAMP_RELAM)

  }


  /**
   * Loads the bundles form the serer and init the view for the user
   * @param osgiApiUrl The server url
   * @param svgCanvas The canvas dom object
   * @returns {Promise.<[bundles, imExportGrpah]>}
   */
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

      main.useMetric(metrics.getMetric("bundles-size-metric-package-count"));
      main.useMetric(metrics.getMetric("bundles-color-metric-uniform"));
      main.useMetric(metrics.getMetric("dependencies-color-metric-uniform"));
      main.useMetric(metrics.getMetric("dependencies-width-metric-uniform"));
      return [bundles,imExports]
    });
  }

  /**
   * Load the class list and
   * @param osgiApiUrl
   * @param svgCanvas
   * @returns {Promise.<string>|Promise}
   */
  initClassVis(osgiApiUrl, svgCanvas ) {

    const classPromise = fetch(osgiApiUrl + "/classes?size=1000")
        .then((res) => res.json())
        .then((data) => data._embedded)
        .then((data) => data.classes);

    return classPromise
  }

  /**
   * trigger connection to the WAMP Router
   * @param url - The WAMP server url
   * @param relam - The WAMP Relam
   * @returns {Promise}
   */
  connectWamp(url, relam){
    return utils.connectToServer(url,relam,this.onJoin.bind(this)).catch(()=>console.error(arguments))
  }

  /**
   * Hook for the subscribe for the Namespace uri
   * @param {Array<object>}msgArr - An array with the actual data
   * @param obj - Meta objects
   * @param event - The event object where you find the topic and other internal ids
   */
  onNamespaceMessage(msgArr,obj,event){
    const channelId = utils.getChannelIdFromEvent(event);
    const msg = msgArr[0];
    console.log(msg, channelId);

    this.displayNamespace(msg.namespace)
  }

  /**
   * Try to find a namespace in the bundle graph and displays tehm.
   * @param {str}namespace - The namespace search string
   */
  displayNamespace(namespace){
    this.initVisPromise.then((result)=>{
      const allBundles = result[0];

      const unmatchedBundlesSelection = vis.getD3Bundles((d3selection)=>{
        console.log( d3selection.bundle.symbolicName, d3selection.bundle.symbolicName.indexOf(namespace) < 0);
        return d3selection.bundle.symbolicName.indexOf(namespace) < 0;
      });
      vis.resetGrayedOutBundles();
      vis.grayOutBundles(unmatchedBundlesSelection);

      const lengthOfMatchedBundles = Math.abs(unmatchedBundlesSelection[0].length - allBundles.length);
      console.log("unmatchedBundlesSelection",unmatchedBundlesSelection[0]);
      console.log("lengthOfMatchedBundles",unmatchedBundlesSelection[0].length,allBundles.length);
      console.log("lengthOfMatchedBundles",lengthOfMatchedBundles);
      if(lengthOfMatchedBundles <= allBundles.length/2 ){
        main.useMetric(metrics.getMetric("dependencies-color-metric-direction"));
        main.useMetric(metrics.getMetric("dependencies-width-metric-uniform"));

        vis.enableRequiredLinks();
        vis.enableImportLinks();
        vis.showLinksOn("always");
      }
    });
  }

  /**
   * Displays sthe classes
   * @param class_name
   */
  displayClass(class_name){

    this.initClassVis().then((classes)=>{

      const class_entry = classes.filter((item)=>item.name.indexOf(class_name) >= 0);

      vis.renderClassGraph(class_entry, svgCanvas);

    })


  }
  onJoin(session){
      console.log("onJoin");
      session.subscribe("sofia.channel..messages.Namespace",this.onNamespaceMessage.bind(this),{ match: "wildcard" })
          .then(()=>console.log("subscribed"))
          .catch(()=>console.error("errror"));
      session.subscribe("sofia.channel..messages.Class",this.onClassMessage.bind(this),{ match: "wildcard" })
          .then(()=>console.log("subscribed"))
          .catch(()=>console.error("errror"));
  }

}

module.exports = App;