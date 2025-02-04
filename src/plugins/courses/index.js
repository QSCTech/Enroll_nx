import { zdbk_xsbtx } from "./zdbk.js"
import * as courses from "./courses.js"
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
            if (curPath === '/note-bene/pdf-viewer') {
                courses.courses_download_pdf();
            } else if (curPath === '/user/index') {
                // 立即请求 /api/todos 数据
                courses.fetchTodoData();
                // 持续观察待办事项 DOM 变化并应用 API 数据
                courses.observeTodoList();
            } else {
                // 处理学在浙大相关功能页面的路由
                let curHandled = false;
                let routing = curURL.pathname.split('/')[3];
                if (routing === 'learning-activity') {
                    let ret = courses.courses_download_video();
                    if (ret !== false) curHandled = true;
                }
                if (curPath.includes("content")) {
                    courses.courses_download_pdf();
                }
                if (webxConfig.runAsBookmark) {
                    let ret = courses.courses_download_pdf();
                    if (ret !== false) curHandled = true; // 找到PDF，URL handled
                }
                if (!curHandled) urlHandled = false;
                courses.courses_download_btn_cleaner();
            }
        } else {
            urlHandled = false;
        }
        

        //书签版检查是否URL handled
        if (webxConfig.runAsBookmark && !urlHandled) {
            alert("[zju-webx]: 对当前页面没有可执行的操作。");
        }
    })();
}