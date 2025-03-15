// 修改后的 popupDownloadBtn 事件处理
popupDownloadBtn.addEventListener('click',() => {
  // 直接调用下载函数并移除弹窗
  download();
  remove();
  
  // 保存用户选择不再显示弹窗
  chrome.runtime.sendMessage({
    action: 'setShowDiv',
    value: false
  });
  
  // 移除原始的下载按钮监听器（重要修复）
  downloadButton.removeEventListener("click", downloadButtonHandler);
});

// 将原来的匿名回调函数提取为命名函数
function downloadButtonHandler() {
  chrome.storage.sync.get('showDiv', ({ showDiv }) => {
    if (showDiv) {
      popup();
    } else {
      download();
    }
  });
}

// 初始化时只绑定一次事件监听
downloadButton.addEventListener("click", downloadButtonHandler);
