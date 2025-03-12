// 10s内的搜索请求如果http状态码是403则reload页面
// 监听特定 URL 的请求，当状态码为403或404时重载页面
export function Search_Quick() {
  console.log("Search_Quick");

  // 定义需要监听的 URL 模式
  const targetUrlPattern = "https://api.cc98.org/topic/*";

  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      console.log("details:", details);

      // 提取状态码
      const statusCode = details.statusCode;
      console.log("statusCode", statusCode);

      // 检查状态码是否为403或404
      if (statusCode === 403 || statusCode === 404) {
        console.log(`reload the page`);

        // 重载当前活动标签页
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs.length > 0) {
            console.log("relaod", tabs[0].id);
            chrome.tabs.reload(tabs[0].id); // 重载页面
          } else {
            console.error("failed to find");
          }
        });
      }
    },
    { urls: [targetUrlPattern] }, // 监听特定 URL
    ["responseHeaders"] // 需要获取响应头
  );
}
