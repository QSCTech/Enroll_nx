export default () => {
    (function () {
      'use strict';
  
      function main() {
        const globalDocument = window.parent.document;
        const observer = new MutationObserver(() => index());
        startObserver(observer);
        function startObserver(observer) {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
  
        function index() {
          const pdfViewer = globalDocument.querySelector('#pdf-viewer');
          if (pdfViewer) {
            console.log('检测到 PDF Viewer');
            const src = pdfViewer.getAttribute('src');
            if (!src) {
              console.log('没有 src，跳过');
              return;
            }
            console.log('PDF 文件的 URL:', src);
            const url = decodeURIComponent(src.substr(src.indexOf('http')));
            console.log('解码后的 URL:', url);
  
            if (!url.includes('http') || !url.includes('https')) {
              downloadPPT();
            } else {
              addDownloadButton(url);
            }
  
            observer.disconnect();
          } else {
            console.log('未检测到 PDF Viewer');
          }
        }
  
        function downloadURL(url) {
          const aEle = globalDocument.createElement('a');
          aEle.href = url;
          globalDocument.body.append(aEle);
          aEle.click();
          setTimeout(() => aEle.remove(), 3000);
          console.log('下载链接点击后已移除');
        }
  
        async function getPPTUrl() {
          return new Promise((resolve, reject) => {
            if (!chrome.runtime) {
              reject(new Error("Chrome runtime API 不可用"));
              return;
            }
  
            chrome.runtime.sendMessage({ action: "getPPTUrl" }, (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
              }
  
              if (!response?.pptUrl) {
                reject(new Error("无效的响应格式"));
                return;
              }
  
              console.log("从背景脚本获取的 PPT URL:", response.pptUrl);
              resolve(response.pptUrl);
            });
          });
        }
  
        async function downloadPPT() {
          try {
            const url = await getPPTUrl();
            console.log('PPT URL:', url);
            addDownloadButton(url);
          } catch (error) {
            console.error("获取 PPT URL 失败:", error);
          }
        }
  
        function addDownloadButton(url) {
          const header = globalDocument.querySelector('.header.clearfix');
          if (header) {
            console.log('内页展示');
  
            const closeBtn = globalDocument.querySelectorAll('.right.close')[1];
  
            const btnEle = globalDocument.createElement('button');
            btnEle.style.position = 'absolute';
            btnEle.style.top = '14px';
            btnEle.style.right = '200px';
            btnEle.id = 'downloadButton';
  
            btnEle.addEventListener('click', () => downloadURL(url));
  
            btnEle.style.border = 'none';
            btnEle.style.background = 'transparent';
            btnEle.style.cursor = 'pointer';
            btnEle.title = '下载完一个文件后请务必刷新页面以继续下载新文件';
  
            const iEle = globalDocument.createElement('i');
            iEle.className = 'font font-download';
            btnEle.appendChild(iEle);
  
            header.insertBefore(btnEle, closeBtn);
          } else {
            if (confirm('Do you want to download this file?')) {
              downloadURL(url);
            }
          }
        }
      }
  
      if (document.readyState === 'loading') {
        console.log('页面加载中...');
        document.addEventListener('DOMContentLoaded', main);
      } else {
        console.log('页面已加载');
        main();
      }
  
    })();
  }
  