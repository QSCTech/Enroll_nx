//学在浙大下载pdf功能
export default ()=>{
    (function () {
        'use strict';
        function main() {
            // console.log(window.parent.document.body)
            var globalDocument = window.parent.document
            // 使用 MutationObserver 监听 DOM 变化
            const observer = new MutationObserver(() => {
                var pdfViewer = globalDocument.querySelector('#pdf-viewer')
                if (pdfViewer) {
                    console.log('已检测到PDF Viewer');
                    var src = pdfViewer.getAttribute('src')
                    if (!src) {
                        console.log('no src, skip')
                        return
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
                    observer.disconnect();
                } else {
                    console.log('未检测到PDF-Viewer')
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            function downloadURL(url) {
                var aEle = globalDocument.createElement('a')
                aEle.href = url
                globalDocument.body.append(aEle)
                aEle.click()
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
                var header = globalDocument.querySelector('.header.clearfix')
                    if (header) {
                        console.log('内页展示')
                        var closeBtn = globalDocument.querySelectorAll('.right.close')[1]
                        var aEle = globalDocument.createElement('a')
                        aEle.style.position = 'absolute'
                        aEle.style.top = '14px'
                        aEle.style.right = '200px'
                        aEle.id='downloadingButton';
                        aEle.href = url;
                        var iEle = globalDocument.createElement('i')
                        iEle.className = 'font font-download'
                        aEle.appendChild(iEle);
                        header.insertBefore(aEle, closeBtn);
                    } else {
                        if (confirm('Do you want to download this file?')) {
                            downloadURL(url);
                        }
                    }
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