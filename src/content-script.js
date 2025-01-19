import ZhiYun_batch from "./plugins/classroom-downloader/batch.js";
import ZhiYun_Index from "./plugins/classroom-downloader/index.js";
import ZDBK_Main from "./plugins/zdbk/index.js";

$(document).ready(async function () {
  //如果是查老师的根目录 即url为 chalaoshi.buzz 或者 http://chalaoshi-buzz-s.webvpn.zju.edu.cn:8001/ url需要完全匹配
  if (
    [
      "https://chalaoshi.buzz/",
      "https://chalaoshi.click/",
      "https://chalaoshi.de/",
      "http://chalaoshi-buzz-s.webvpn.zju.edu.cn:8001/",
      "http://chalaoshi-click-s.webvpn.zju.edu.cn:8001/",
      "http://chalaoshi-de-s.webvpn.zju.edu.cn:8001/",
    ].includes(window.location.href) ||
    //如果是zdbk选课页面 url包含 http://zdbk.zju.edu.cn/jwglxt/xsxk
    window.location.href.includes("http://zdbk.zju.edu.cn/jwglxt/xsxk")
  ) {
    ZDBK_Main();
  }

  //批量下载视频功能：
  else if (
    window.location.href.includes(
      "https://classroom.zju.edu.cn/coursedetail"
    ) &&
    !window.location.href.includes("livingroom")
  ) {
    ZhiYun_batch();
  }
  //单独下载视频功能：
  else if (
    window.location.href.includes(
      "https://classroom.zju.edu.cn/livingpage?"
    ) || window.location.href.includes(
      "https://interactivemeta.cmc.zju.edu.cn/"
    ) ||window.location.href.includes(
      'https://classroom.zju.edu.cn/livingroom?'
    )
  ) {
    // NOTE by 5dbwat4:
    // 无法理解的语句... 按照外层if，域名只有可能是classroom.zju.edu.cn
    // 里面interactivemeta.cmc.zju.edu.cn根本不可能成立
    // 感觉是复制的时候弄岔了
    // 总之挪到./plugins/classroom-downloader/index.js里了，写这段代码的人到时候看一下
    ZhiYun_Index();
  }
});
