import { zdbk_xsbtx } from "./zdbk.js"
import * as courses from "./todos.js"
import downloadpdf from "./pdfDownloading.js";
import "./la-locean-coursewarre-download.js";
const webxConfig = {
    runAsBookmark: false,
    theme: {//一些主题颜色设置
        mainColor: '#003f88',//浙大蓝
        bgColor: '#BAD4EA',//教务网背景浅蓝
    }
}

export default () => {
    (function () {
        'use strict';
        console.log('[zju-webx]:running');
        let curURL = new URL(window.location.href);//对于webvpn，此处返回的也是目标页面的url，不用特殊处理
        let curPath = curURL.pathname;

        let urlHandled = true;//如果是未处理的URL则后面赋为false
        if (curURL.hostname === 'zdbk.zju.edu.cn') {
            if (curPath === '/jwglxt/xsbtx/xsbtx_cxXsbtxIndex.html') {
                zdbk_xsbtx();
            } else {
                urlHandled = false;
            }
        }
        else if (curURL.hostname === 'courses.zju.edu.cn') {
            courses.fetchTodoData();
            courses.observeTodoList();
            downloadpdf();
        }
        else {
            urlHandled = false;
        }
        

        //书签版检查是否URL handled
        if (webxConfig.runAsBookmark && !urlHandled) {
            alert("[zju-webx]: 对当前页面没有可执行的操作。");
        }
    })();
}