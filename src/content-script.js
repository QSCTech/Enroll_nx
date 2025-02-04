import ZhiYun_batch from "./plugins/classroom-downloader/batch.js";
import ZhiYun_Index from "./plugins/classroom-downloader/index.js";
import ZDBK_Main from "./plugins/zdbk/index.js";
import Book_Display from "./plugins/zdbk/bookDisplay.js";
import Courses_Index from "./plugins/courses/index.js"
$(document).ready(async function () {
  //如果是查老师的根目录 即url为 chalaoshi.click 或者 http://chalaoshi-clickz-s.webvpn.zju.edu.cn:8001/ url需要完全匹配
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

  //智云课堂批量下载视频功能：
  else if (
    window.location.href.includes(
      "https://classroom.zju.edu.cn/coursedetail"
    ) &&
    !window.location.href.includes("livingroom")
  ) {
    ZhiYun_batch();
  }
  //智云课堂单独下载视频功能：
  else if (
    window.location.href.includes("https://classroom.zju.edu.cn/livingpage?") ||
    window.location.href.includes("https://interactivemeta.cmc.zju.edu.cn/") ||
    window.location.href.includes("https://classroom.zju.edu.cn/livingroom?")
  ) {
    ZhiYun_Index();
  } else if (
    window.location.href.includes("http://zdbk.zju.edu.cn/jwglxt/xsxjc")
  ) {
    Book_Display();
  }
  //学在浙大只可查看的课件下载、教务网补选显示老师等功能：
  else if(
    window.location.href.includes("http://zdbk.zju.edu.cn")||
    window.location.href.includes("https://courses.zju.edu.cn")
  ){
    Courses_Index();
  }
});
