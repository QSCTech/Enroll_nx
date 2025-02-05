//学在浙大下载pdf功能
(function() {
    'use strict';
    function main() {
        // console.log(window.parent.document.body)
        var globalDocument = window.parent.document
        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(() => {
            var pdfViewer = globalDocument.querySelector('#pdf-viewer')
            if (pdfViewer) {
                console.log('已检测到PDF Viewer')
                var src = pdfViewer.getAttribute('src')
                if (!src) {
                    console.log('no src, skip')
                    return
                }
                var url = decodeURIComponent(src.substr(src.indexOf('http')))
                var header = globalDocument.querySelector('.header.clearfix')
                if (header) {
                    console.log('内页展示')
                    var closeBtn = globalDocument.querySelectorAll('.right.close')[1]
                    var aEle = globalDocument.createElement('a')
                    aEle.style.position = 'absolute'
                    aEle.style.top = '14px'
                    aEle.style.right = '200px'
                    aEle.href = url
                    var iEle = globalDocument.createElement('i')
                    iEle.className = 'font font-download'
                    aEle.appendChild(iEle)
                    header.insertBefore(aEle, closeBtn)
                } else {
                    if (confirm('Do you want to download this file?')) {
                        downloadURL(url)
                    }
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
        function downloadURL(url){
            var aEle = globalDocument.createElement('a')
            aEle.href = url
            globalDocument.body.append(aEle)
            aEle.click()
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