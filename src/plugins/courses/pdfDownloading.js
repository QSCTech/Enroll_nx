//学在浙大下载pdf功能
export default ()=>{
    (function () {
        'use strict';
        function main() {
            // console.log(window.parent.document.body)
            var globalDocument = window.parent.document;
            let timeout;
            clearTimeout(timeout);
            timeout=setTimeout(() => {
                var pdfViewer = globalDocument.querySelector('#pdf-viewer')
                if (pdfViewer) {
                    console.log('已检测到PDF Viewer');
                    var src = pdfViewer.getAttribute('src')
                    if (!src) {
                        console.log('no src, skip')
                        return;
                    }
                    console.log(src);
                    var url = decodeURIComponent(src.substr(src.indexOf('http')))
                    console.log(url);
                    if (!url.includes('http') || !url.includes('https')) {
                        downloadPPT();
                    }
                    else{
                        addDownloadButton(url);
                    }
                } else {
                    console.log('未检测到PDF-Viewer')
                }
            },3000);
            function downloadURL(url) {
                var aEle = globalDocument.createElement('a')
                aEle.href = url
                globalDocument.body.append(aEle)
                aEle.click();
                setTimeout(()=> aEle.remove(),3000);
                console.log('aEle is removed');
                clean_btn();
            }
            async function getPPTUrl() {
                return new Promise((resolve, reject) => {
                  if (!chrome.runtime) {
                    reject(new Error("Chrome runtime API不可用"));
                    return;
                  }
                  
                  chrome.runtime.sendMessage({ action: "getPPTUrl" }, (response) => {
                    // 检查Chrome API的错误
                    if (chrome.runtime.lastError) {
                      reject(new Error(chrome.runtime.lastError.message));
                      return;
                    }
              
                    // 检查响应有效性
                    if (!response?.pptUrl) {
                      reject(new Error("无效的响应格式"));
                      return;
                    }
              
                    console.log("从背景脚本获取的数据：", response.pptUrl);
                    resolve(response.pptUrl);
                  });
                });
              }
            async function downloadPPT(){
                try {
                    const pptUrl = await getPPTUrl();
                    console.log(pptUrl);
                    addDownloadButton(pptUrl);
                  } catch (error) {
                    console.error("获取PPT URL失败:", error);
                  }
            }
            function addDownloadButton(url){
                clean_btn();
                var header = globalDocument.querySelector('.header.clearfix')
                if (header) {
                    console.log('内页展示')
                    var closeBtn = globalDocument.querySelectorAll('.right.close')[1]
                    // 创建 button 元素
                    var btnEle = globalDocument.createElement('button');
                    btnEle.style.position = 'absolute';
                    btnEle.style.top = '14px';
                    btnEle.style.right = '200px';
                    btnEle.id = 'downloadButton';

                    // 添加点击事件（替代原 href 的直接下载）
                    btnEle.addEventListener('click', ()=>downloadURL(url));

                    // 设置按钮样式（可选：移除默认按钮样式）
                    btnEle.style.border = 'none';
                    btnEle.style.background = 'transparent';
                    btnEle.style.cursor = 'pointer';
                    btnEle.title='下载完一个文件后请务必刷新页面以继续下载新文件';
                    // 创建图标并插入按钮
                    var iEle = globalDocument.createElement('i');
                    iEle.className = 'font font-download';
                    btnEle.appendChild(iEle);

                    // 插入到 DOM
                    header.insertBefore(btnEle, closeBtn);
                } else {
                    if (confirm('Do you want to download this file?')) {
                        downloadURL(url);
                    }
                }
            }
            function clean_btn() {
                let btn = document.getElementById('downloadButton');
                if (btn) btn.remove();
                console.log('btn killed');
            }
        }
        if (document.readyState === 'loading') {
            console.log('loading')
            document.addEventListener('DOMContentLoaded', main)
        } else {
            console.log('ready')
            main()
        }
    
    })();
}
//下载完成后url不变，必须刷新。自动清楚更新url实现。
//尝试不用监听器直接抓取