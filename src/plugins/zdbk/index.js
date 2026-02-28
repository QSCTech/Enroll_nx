import { autoScroll } from "./autoScroll.js";
import { bindForgeClick } from "./bindForgeClick.js";
import { forgePrepareSearch } from "./forgePrepareSearch.js";
import { lessonTableMatch } from "./lessonTableMatch.js"

let globalConfig = {
  enableDataExpirationReminders: true,
};

export default async () => {
  //设定一个全局变量 数据过期时间
  var expireTime = 1000 * 60 * 60 * 24 * 7; //7天
  console.log("选课插件已启动");
 
  await init();

  if (
    [
      "https://chalaoshi.buzz/",
      "https://chalaoshi.click/",
      "https://chalaoshi.de/",
      "http://chalaoshi-buzz-s.webvpn.zju.edu.cn:8001/",
      "http://chalaoshi-click-s.webvpn.zju.edu.cn:8001/",
      "http://chalaoshi-de-s.webvpn.zju.edu.cn:8001/",
      "https://0.e.0.0.1.1.f.1.0.7.4.0.1.0.0.2.ip6.arpa/"
    ].includes(window.location.href)
  ) {
    let config = await loadConfig();
    globalConfig = config.config;
    //获取当前时间
    let nowTime = new Date().getTime();
    // //获取本地存储的数据
    let localData = localStorage.getItem("search-data");
    let localTime = localStorage.getItem("search-last-update");
    //localTime 字符串转数字
    localTime = Number(localTime);
    //如果本地存储的数据存在 并且没有过期
    if (localData && nowTime - localTime < expireTime) {
      //直接使用本地存储的数据
      console.log("发现本地存储的数据");
      await updateChromeStorage(localData, localTime);
      await getLocalData("needUpdate").then((result) => {
        if (result && result.needUpdate) {
          //这里提醒主要是为了符合逻辑  用户在打开zdbk的时候提示需要更新 提醒打开查老师后需要告知一次用户数据已经更新 实际上做的时候是次次更新
          desktop_notification(
            "选课插件提示",
            "检测到打开查老师，评分数据已更新",
            10000
          );
          //更新完毕后将needUpdate设置为false
          chrome.storage.local.set({ needUpdate: false }, function () {
            console.log("needUpdate已写入插件储存空间");
          });
        }
      });
    } else {
      //如果过期了或者没有数据 模拟点击查老师搜索框获取数据 并再从本地存储中获取
      try {
        await forgePrepareSearch();
        //获取本地存储的数据
        localData = localStorage.getItem("search-data");
        localTime = localStorage.getItem("search-last-update");

        //如果获取为空  丢出错误
        if (!localData || !localTime) {
          throw new Error("获取数据失败");
        }

        console.log("模拟点击查老师搜索框获取数据");
        console.log(localData);
        console.log(localTime);
        console.log("将页面存储的数据写入插件储存空间");
        await updateChromeStorage(localData, localTime);
        desktop_notification(
          "选课插件提示",
          "检测到打开查老师，评分数据已更新",
          10000
        );
      } catch (e) {
        console.log("模拟点击查老师搜索框获取数据失败", e);
        desktop_notification(
          "选课插件提示",
          "检测到打开查老师，查老师未响应，请稍后再试",
          10000
        );
      }
    }
  } else if (
    window.location.href.includes("https://zdbk.zju.edu.cn/jwglxt/xsxk")
    || window.location.href.includes("http://zdbk.zju.edu.cn/jwglxt/xsxk")
  ) {
    let localTime = await getLocalData("search-last-update");
    localTime = localTime["search-last-update"];
    //字符串转数字
    localTime = Number(localTime);

    if (!localTime || new Date().getTime() - localTime > expireTime) {
      if (globalConfig.enableDataExpirationReminders) {
        desktop_notification(
          "选课插件提示",
          "评分数据已过期，点击打开查老师页面更新评分",
          20000,
          "https://0.e.0.0.1.1.f.1.0.7.4.0.1.0.0.2.ip6.arpa"
        );
        //此处暂时不返回 避免影响后续代码执行
        //全局变量 存一个needUpdate 用于判断是否需要更新数据
        await new Promise((resolve, reject) => {
          chrome.storage.local.set({ needUpdate: true }, function () {
            console.log("needUpdate已写入插件储存空间");
            resolve(true);
          });
        });
      }
    }

    let localData = await getLocalData("search-data");
    if (!localData) {
      desktop_notification(
        "选课插件提示",
        "评分数据异常，点击打开查老师页面更新评分",
        20000
      );
      return;
    }
    startZDBKInject();
  }
};

//封装chrome.storage.local.get 为promise 这玩意很奇怪...包一层得了
export function getLocalData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      //如果result是空对象
      if (Object.keys(result).length === 0) {
        resolve(null);
        return;
      }
      resolve(result);
    });
  });
}

export function startZDBKInject() {
  // 开始监听 整体选课栏目 发生变化时触发自动下拉滚动与绑定点击事件
  observer.observe(targetNode, config);

  //查找 id为#nextPage 的元素 如果存在 点他一下
  if ($("#nextPage").length > 0) {
    //如果#nextpage元素存在href属性 移除href属性 避免chrome报错
    if ($("#nextPage").attr("href")) {
      $("#nextPage").removeAttr("href");
    }
    $("#nextPage")[0].click();
    bindForgeClick();
  }

  $(window).scroll(function () {
    autoScroll();
    bindForgeClick();
  });
}

// 选择要观察变化的目标节点
const targetNode = document.getElementById("contentBox");

// 创建一个MutationObserver实例并传入回调函数
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // 检查变化类型是否为子节点的添加
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // 在这里执行你的函数
      console.log("选课系统界面栏目已切换 启动默认下拉");
      autoScroll();
      bindForgeClick();
    }
  });
});

// 配置观察器以监视子节点的变化
const config = { childList: true };

//把上面的函数改为promise
async function updateChromeStorage(localData, localTime) {
  await chrome.storage.local.set({
    "search-data": localData,
    "search-last-update": localTime,
  });
  console.log("数据已写入插件储存空间");
  return true;
}

//插件初始化函数
async function init() {
  //检查缓存中 isinit 是否为true
  let result = await getLocalData("isinit");

  if (result && result.isinit) {
    console.log("插件已初始化");
    return;
  }
  //执行初始化逻辑

  const response = await fetch(chrome.runtime.getURL("/assets/chalaoshiData.json"));
  const data = await response.json();

  //这里没做错误处理 请求自己本地的json如果还能出错那是真的🐂🍺

  //将json文件写入chrome缓存
  console.log("加载json文件至chrome缓存", data);

  await new Promise((resolve, reject) => {
    chrome.storage.local.set(
      { "search-data": JSON.stringify(data) },
      function () {
        console.log("数据已写入插件储存空间");
        resolve(true);
      }
    );
  });
  await new Promise((resolve, reject) => {
    chrome.storage.local.set({ "search-last-update": 0 }, function () {
      console.log("数据时间已写入插件储存空间");
      resolve(true);
    });
  });

  //然后写入插件配置项
  //dataExpirationReminders 默认为true 用于判断是否需要提醒数据过期
  //lessonListAutoScroll 默认为true 用于判断是否需要自动下拉
  //打包成一个对象写入插件缓存 key名为config
  await new Promise((resolve, reject) => {
    chrome.storage.local.set(
      {
        config: {
          enableDataExpirationReminders: false,
          enableLessonListAutoScroll: true,
        },
      },
      function () {
        console.log("配置已写入插件储存空间");
        resolve(true);
      }
    );
  });

  await new Promise((resolve, reject) => {
    chrome.storage.local.set({ isinit: true }, function () {
      console.log("初始化成功");
      resolve(true);
    });
  });
}

async function loadConfig() {
  //用于防止爆炸的默认配置 按照正常启动流程应该不会用到 在init函数中必定写入
  const defaultConfig = {
    enableDataExpirationReminders: true,
    lessonListAutoScroll: true,
  };

  //设置页加载时需要先加载配置
  const config = await new Promise((resolve, reject) => {
    chrome.storage.local.get("config", function (result) {
      // console.log('配置已读取', result);
      resolve(result);
    });
  });
  console.log("配置", config);
  //校验config是否为空对象
  if (Object.keys(config).length === 0) {
    //如果为空对象 使用默认配置 并丢出警告
    console.warn("配置为空对象 使用默认配置");
    return defaultConfig;
  }
  return config;
}

//系统通知接口函数
function desktop_notification(title, data, closeTime = 3000, url = "") {
  //由于content-script.js无法使用chrome.notifications 需要通过background.js来发送消息
  chrome.runtime.sendMessage(
    {
      data: {
        title: title,
        message: data,
        closeTime: closeTime,
        url: url,
      },
    },
    function (response) {
      console.log("收到来自后台的回复：" + response);
    }
  );
}

window.addEventListener("load", lessonTableMatch);
