import { ZhiYunPPTInit, interactivemetaInit } from "./download.js";

export default () => {
  (function () {
    const host = new URL(window.location.href).host;
    if (/classroom\.zju\.edu\.cn/.test(host)) {
      ZhiYunPPTInit();
    }

    if (/interactivemeta\.cmc\.zju\.edu\.cn/.test(host)) {
      interactivemetaInit();
    }
    // 动态添加 Font Awesome 的 CDN 链接
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'; // 海外 CDN
    document.head.appendChild(link);
  })();
};
