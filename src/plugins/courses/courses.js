//-------------学在浙大 ---------------------------

import {set_download_btn,extract_filename,wait_element,insert_after,watch} from "./utilties"
const webxConfig = {
    runAsBookmark:false,
    theme :{//一些主题颜色设置
        mainColor:'#003f88',//浙大蓝
        bgColor:'#BAD4EA',//教务网背景浅蓝
    } 
}
export function new_btn(doc) {
    let btn = doc.createElement('span');
    btn.style = `
        height:20px;
        font-size:12px;
        margin-left:15px;
        padding-left: 7px;
        padding-right: 7px;
        min-width:fit-content;
        line-height:100%;
    `;
    btn.classList.add('button');
    return btn;
}
export function set_viewlink_btn(doc,btn, fileSrc) {
    let popupHtml=`<div id='zju-webx-bg' class="reveal-modal-bg" style="display: block;z-index:9998;"></div>
    <div id="link-view-popup" class="reveal-modal popup-area popup-480 ng-scope open" data-reveal="" resetable=""
        style="display: block; opacity: 1; visibility: visible;z-index:9999;" aria-hidden="false" tabindex="0">
        <div class="popup-content ng-scope" ng-if="popupState.popupOpened" style="margin-top: 243px;">
            <div class="popup-header"> <span>查看链接 - 可选中后复制</span> </div>
            <div class="main-area" style='padding:20px;word-break: break-all;!important'> ${fileSrc} </div>
            <div class="popup-footer">
                <div class="form-buttons">
                    <button class="button button-green medium" close-popup="link-view-popup" type="button"
                        ng-hide="loading" 
                        onclick="document.getElementById('zju-webx-viewlink').remove();">
                        <span>确定</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
    function viewlink() {
        let popup = doc.createElement('div');
            popup.id = 'zju-webx-viewlink';
            popup.innerHTML = popupHtml;
        doc.body.appendChild(popup);
    }
    btn.addEventListener('click', viewlink);
}
export function clean_btn() {
    let daList = document.getElementsByClassName('zju-webx-downloadBtn');
    if (daList) daList.forEach(da => da.remove());
    console.log('da all killed');
    let caList = document.getElementsByClassName('zju-webx-viewlinkBtn');
    if (caList) caList.forEach(ca => ca.remove());
    console.log('ca all killed');
}
export function courses_download_pdf()//匹配预览PDF的iframe时增加下载课件按钮
{
    
    console.log('[zju-webx]:courses download pdf');
    let topDocument = window.parent.document;
    let pdfViewer = topDocument.getElementById('pdf-viewer');
    if (!pdfViewer) {
        console.log("[zju-webx]: pdf-viewer not found");
        return false;
    }
    console.log('[zju-webx]: found pdfviewer'); 
    //get file src link
    function get_fileSrc(src) {
        try {
            var fileSrc;
            var reg = /https:\/\/courses\.zju\.edu\.cn\/note-bene\/pdf-viewer\?file=(.*)\&upload_id=.*/;
            fileSrc = reg.exec(src)[1];//从src链接中提取源文件链接，此时其中的冒号和斜杠为%2A%2F，需要处理
            var reg_c = /%[0-9,A-F]{2}/g;
            fileSrc = fileSrc.replace(reg_c, function (utf) {
                var code16str = utf.substring(1);
                var code16 = parseInt(code16str, 16);
                return String.fromCharCode(code16);
            });//将%形式的字符转换为正常字符
            return fileSrc;
        } catch (e) {
            console.log(e);
            alert(`[zju-webx]:文件名解析失败！\n${e.name}:${e.message}`);
            return null;
        }
    }//end get_fileSrc
    //add link
    let titleBar = topDocument.querySelector('#file-previewer-with-note div.pdf-reader-detail>div.header');
    if (!titleBar) {
        console.error('titlebar not found');
        return;
    }
    let fileSrc, filename, fileExt, nameWithoutExt, friendlyName;
    try {
        fileSrc = get_fileSrc(pdfViewer.src);
        filename = extract_filename(fileSrc);
        fileExt = filename.substring(filename.lastIndexOf("."));
        nameWithoutExt = titleBar.querySelector('span[tipsy="upload.name"]').innerText;
        friendlyName = nameWithoutExt + fileExt;
    } catch (e) {
        console.log(e);
        alert(`[zju-webx]:文件名解析失败！\n${e.name}:${e.message}`);
        return;
    }

    //add download btn
    let downloadBtn = new_btn(topDocument);
        downloadBtn.classList.add('button-green');	
        downloadBtn.classList.add('zju-webx-downloadBtn');
        downloadBtn.innerText = '下载PDF';
        downloadBtn.title = "下载当前课件的PDF文件。\n（PPT、Word等其他格式的课件在上传学在浙大时会自动转码成PDF）\n仅供学习用途使用，课件请勿外传！";
        set_download_btn(downloadBtn, fileSrc, friendlyName,
            'button button-green zju-webx-downloadBtn',
            'button button-red zju-webx-downloadBtn');

    titleBar.append(downloadBtn);

    //add viewlink btn
    let viewlinkBtn = new_btn(topDocument);
        viewlinkBtn.classList.add('zju-webx-viewlinkBtn');
        viewlinkBtn.innerText = "查看链接";
        set_viewlink_btn(topDocument,viewlinkBtn,fileSrc);
        titleBar.appendChild(viewlinkBtn);

    if (webxConfig.runAsBookmark) {
        downloadBtn.click();//尝试唤起浏览器下载
    }

}
export function courses_download_video()//在视频页面增加一个复制链接按钮
{
    
    console.log('[zju-webx]:courses download video');
    let mainContent = document.getElementsByClassName('main-content')[0];
    if (!mainContent) {
        console.log('main-content not found');
        return;
    }
    else console.log('found main-content');
    function on_video_box(video) {
        let titleBar = mainContent.querySelector('.activity-title.online-video');
        if (!titleBar) {
            console.error('titleBar not found');
        }
        function on_video_url(src) {
            clean_btn();
            //get filename
            let filename, fileExt, nameWithoutExt, resolution,friendlyName;
            try {
                filename = extract_filename(src);
                fileExt = filename.substring(filename.lastIndexOf("."));
                nameWithoutExt = titleBar.querySelector('span[tipsy="activity.title"]').innerText;
                resolution = document.getElementsByClassName('vjs-resolution-button-label')[0].innerText;
                friendlyName = nameWithoutExt + '_' + resolution + fileExt;
            } catch (e) {
                console.log(e);
                alert(`[zju-webx]:文件名解析失败！\n${e.name}:${e.message}`);
                return;
            }
            // add download btn
            let downloadBtn = new_btn(document);
                downloadBtn.classList.add('button-green');
                downloadBtn.classList.add('zju-webx-downloadBtn');
                downloadBtn.innerText = "下载视频";
                set_download_btn(downloadBtn, src, friendlyName,
                    'button button-green zju-webx-downloadBtn',
                    'button button-red zju-webx-downloadBtn');
            titleBar.append(downloadBtn);
            //add viewlink btn
            let viewlinkBtn = new_btn(document);
                viewlinkBtn.classList.add('zju-webx-viewlinkBtn');
                viewlinkBtn.innerText = "查看链接";
                set_viewlink_btn(document,viewlinkBtn,src);
            titleBar.appendChild(viewlinkBtn);

            //视频一般比较大，因此不启用自动下载
        }
        console.log('current video src:', video.src);

        if (webxConfig.runAsBookmark) {
            fetch(video.src, { method: 'GET' })
            .then(res => res.url)
            .then(url => on_video_url(url));
        }
        else watch(//监视video src属性的变化，因为一开始找到video时src还未指定，并且调整清晰度也会改变src
            video, { attributes: true, attributeFilter: ['src'] },
            mutation => {
                if (mutation.target.src) {
                    console.log('video src changed to ',mutation.target.src);
                    clean_btn();
                    fetch(mutation.target.src, { method: 'GET' })
                    .then(res => res.url)
                    .then(url => on_video_url(url));
                }
            }
        )
    }
    function wait_video() {
        window.countVideo = 0;//performance measurement
        if (window.videoWaiter) return;//保证每次有且仅有一个video waiter
        let videoGetter = () => {
            window.countVideo++;
            let tmpVideo = document.getElementsByTagName('video')[0];
            if (tmpVideo && tmpVideo.classList.contains('vjs-tech')) {//必需，因为在页面加载时会加载一个临时的非目标video元素
                return tmpVideo;
            }
            else return undefined;
        }
        window.videoWaiter = wait_element({
            getter: videoGetter,//getter
            callback: videoBox => {
                            console.log('found video, action counts: ', window.countVideo);
                            on_video_box(videoBox);
                        },
            watchOn: mainContent,
            recursive: true
        })
    }
    if (webxConfig.runAsBookmark) {
        let tmpVideo = document.getElementsByTagName('video')[0];
        if (tmpVideo && tmpVideo.classList.contains('vjs-tech')) {//必需，因为在页面加载时会加载一个临时的非目标video元素
            on_video_box(tmpVideo);
        }
        else return false;
    }
    else {
        wait_video();
        window.onhashchange = wait_video;//在切换视频时也追踪        
    }

}
export function courses_download_btn_cleaner() {//辅助函数，用于清除由pdf-viewer iframe特性引起的无法删除按钮问题
    console.log('[zju-webx]:courses download cleaner');
    function on_filePreviewer(filePreviewer) {
        console.log('[zju-webx]:found file previewer');
        watch(filePreviewer, { attributes: true, attributeFilter: ['aria-hidden'] }, mutation => {
            if (mutation.target.getAttribute('aria-hidden') == 'true')//is closing
            {//预览窗口 关闭，全局追杀添加的按钮 
                console.log('[zju-webx]:file previewer close');
                clean_btn();
            }
        });
    }
    wait_element({
        getter: () => document.getElementById('file-previewer-with-note'),
        callback: on_filePreviewer,
        watchOn: document.body//parent
    })
}


const PLUGIN_PREFIX = "[ZJU XZZD TODO URL]";
// 主动请求待办事项的 API 数据
export function fetchTodoData() {
    const apiUrl = '/api/todos?no-intercept=true';
    console.log(`${PLUGIN_PREFIX} Fetching data from ${apiUrl}`);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(`${PLUGIN_PREFIX} Received API Response:`, data);

            // 检查 data.todo_list 是否是数组，并处理API数据
            if (data && Array.isArray(data.todo_list)) {
                processTodoListFromAPI(data.todo_list); // 处理API中的todo_list

                // 加入延时处理，确保页面完全加载
                setTimeout(() => {
                    console.log(`${PLUGIN_PREFIX} Re-checking todos after delay...`);
                    processTodoListFromAPI(data.todo_list); // 再次处理待办事项
                }, 2000);  // 2秒延时
            } else {
                console.error(`${PLUGIN_PREFIX} API todo_list is missing or not an array:`, data);
            }
        })
        .catch(error => {
            console.error(`${PLUGIN_PREFIX} Error fetching API data:`, error);
        });
}

// 处理从 API 获取的待办事项列表
export function processTodoListFromAPI(todoList) {
    console.log(`${PLUGIN_PREFIX} Processing API Data`);

    // 观察页面上的 DOM，等待待办事项加载
    const observer = new MutationObserver(() => {
        const todoListDom = document.querySelector(".latest-todo-list.card.gtm-label");
        if (todoListDom) {
            console.log(`${PLUGIN_PREFIX} Found .latest-todo-list! Processing todos...`);

            // 遍历 API 数据并应用到页面中的待办事项
            todoList.forEach(activity => {
                const activityTitle = activity.title;
                const courseId = activity.course_id;
                const activityId = activity.id;

                console.log(`${PLUGIN_PREFIX} Processing activity: ${activityTitle} (Course ID: ${courseId}, Activity ID: ${activityId})`);

                // 匹配页面中的待办事项标题
                document.querySelectorAll('a[ng-click="openActivity(todoData)"]').forEach((linkElement) => {
                    const titleElement = linkElement.querySelector('span[ng-bind="todoData.title"]');
                    if (titleElement) {
                        const pageTitle = titleElement.textContent.trim();
                        // console.log(`${PLUGIN_PREFIX} Found todo item in page with title: ${pageTitle}`);

                        // 比较 API 返回的 title 和页面中的 title
                        if (pageTitle === activityTitle.trim()) {
                            console.log(`${PLUGIN_PREFIX} Title matched: ${activityTitle}`);

                            // 构造正确的跳转链接
                            const targetUrl = `https://courses.zju.edu.cn/course/${courseId}/learning-activity#/${activityId}`;
                            linkElement.setAttribute('href', targetUrl);
                            linkElement.setAttribute('target', '_blank'); // 可选：在新标签页中打开
                            console.log(`${PLUGIN_PREFIX} Link updated for activity: ${activityTitle} -> ${targetUrl}`);
                        }
                    }
                });
            });

            // 停止观察
            observer.disconnect();
        }
    });

    // 观察整个页面的 DOM 变化，直到找到 .latest-todo-list
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 直接观察待办事项部分的 DOM 变化
export function observeTodoList() {
    const observer = new MutationObserver(() => {
        const todoListDom = document.querySelector(".latest-todo-list.card.gtm-label");
        if (todoListDom) {
            console.log(`${PLUGIN_PREFIX} .latest-todo-list is loaded and ready for processing.`);
            observer.disconnect(); // 停止观察
        }
    });

    // 观察整个页面的 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}