chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let data = request.data;
  showDataOnPage(data.title, data.message, data.closeTime, data.url);
  sendResponse("已执行弹窗");
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
        chrome.notifications.clear(notificationId, function () {});
      }

      // 注册监听器
      chrome.notifications.onClicked.addListener(onClicked);

      // 设置定时器，在指定时间后清除通知
      setTimeout(function () {
        chrome.notifications.clear(id, function () {});
        // 移除监听器
        chrome.notifications.onClicked.removeListener(onClicked);
      }, closeTime);
    });
  } else {
    console.error("chrome.notifications is not available");
  }
}
