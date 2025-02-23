chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getPPTUrl") {
    chrome.storage.sync.get(["pptUrl"], function(result) {
      sendResponse({ pptUrl: result.pptUrl });
    });
    // 需要返回 true，表示异步响应
    return true;
  }
  else if (request.action === 'setShowDiv') {
    chrome.storage.sync.set({ showDiv: request.value }, () => {
      console.log(`设置 showDiv 为: ${request.value}`);
    });
    sendResponse({ status: 'success' });
  }
  else{
    let data = request.data;
    showDataOnPage(data.title, data.message, data.closeTime, data.url);
    sendResponse("已执行弹窗");
  }
});


// 将data数据以桌面通知的方式显示给用户
function showDataOnPage(title, data, closeTime = 3000, url = "") {
  if (chrome.notifications) {
    let opt = {
      type: "basic",
      title: title,
      message: data,
      iconUrl: chrome.runtime.getURL("icon.png"),
    };

    chrome.notifications.create("", opt, function (id) {
      // 定义点击通知的回调函数
      function onClicked(notificationId) {
        console.log("click notification", url);
        if (url) {
          console.log("open url", url);
          chrome.tabs.create({ url: url });
        }
        // 清除通知
        chrome.notifications.clear(notificationId, function () { });
      }

      // 注册监听器
      chrome.notifications.onClicked.addListener(onClicked);

      // 设置定时器，在指定时间后清除通知
      setTimeout(function () {
        chrome.notifications.clear(id, function () { });
        // 移除监听器
        chrome.notifications.onClicked.removeListener(onClicked);
      }, closeTime);
    });
  } else {
    console.error("chrome.notifications is not available");
  }
}


chrome.webRequest.onCompleted.addListener(
  function(details) {
    // 检查请求的 URL 是否匹配目标 API
    if (details.url.includes('/api/uploads/reference/document/')) {
      // 通过 fetch 重新发起请求获取响应数据
      fetch(details.url)
        .then(response => response.json())
        .then(data => {
          // 假设返回的数据包含目标 PPT 下载 URL
          if (data && data.url) {
            // 存储 URL 到 chrome.storage
            chrome.storage.sync.set({ pptUrl: data.url }, () => {
              console.log('PPT URL 已存储:', data.url);
            });
          }
          else{
            console.log('fail to save pptUrl');
          }
        })
        .catch(error => console.error('获取数据失败:', error));
    }
  },
  { urls: ["https://courses.zju.edu.cn/api/uploads/reference/document/*/url"] },
);
// 监听插件安装时初始化设置
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ showDiv: true }, () => {
    console.log("插件初始化：显示 div");
  });
});

