import {ZhiYunPPTInit,interactivemetaInit}from "./download.js"

export default ()=>{

(function () {
    const host = new URL(window.location.href).host;
    if (/classroom\.zju\.edu\.cn/.test(host)) {
      ZhiYunPPTInit();
    }

    if (/interactivemeta\.cmc\.zju\.edu\.cn/.test(host)) {
      interactivemetaInit();
    }

    // Your code here...
  })();

}