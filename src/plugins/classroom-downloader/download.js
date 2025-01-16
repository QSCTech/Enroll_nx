export function downloadVideo() {
  const courseName =
    document.getElementsByClassName("course_name")[0].innerText;
  const videoSrc = document.getElementById("cmc_player_video").src;
  const vLink = document.createElement("a");
  vLink.href = videoSrc;
  vLink.target = "_blank";
  vLink.download = courseName ? courseName : "ZhiYunPPT";
  document.body.appendChild(vLink);
  vLink.click();
  document.body.removeChild(vLink);
}

export function interactivemetaInit() {
  const btnStyle = "cursor:pointer;text-decoration:underline;";
  const lineStyle = "padding:5px 0;";
  const wrap = document.createElement("div");
  wrap.style =
    "margin:0;padding:12px;width:280px;height:60vh;position:fixed;top:0;left:40%;background:#fff;z-index:9999;opacity:0.8;border-left:solid 2px #008000;border-bottom:solid 2px #008000;font-size:14px;";
  const p1 = document.createElement("p");
  p1.innerHTML =
    "请待页面下载完成，视频开始播放后,打开PPT侧边栏后进行：</p><p>注意：点击提取图片后，若生成的压缩包大小较小，说明解析失败，不要下载，直接重新点击提取即可。";
  p1.style = lineStyle;

  const p2 = document.createElement("p");
  p2.innerText = "点击下载视频";
  p2.style = lineStyle + btnStyle;
  p2.addEventListener("click", downloadVideo2);

  const p3 = document.createElement("p");
  p3.innerText = "";
  p3.style = lineStyle;

  wrap.appendChild(p1);
  wrap.appendChild(p2);
  wrap.appendChild(p3);
  document.body.appendChild(wrap);

  function downloadVideo2() {
    const courseName = "";
    const videoSrc = document.getElementById("cmc_player_video").src;
    const vLink = document.createElement("a");
    vLink.href = videoSrc;
    vLink.target = "_blank";
    vLink.download = courseName ? courseName : "ZhiYunPPT";
    document.body.appendChild(vLink);
    vLink.click();
    document.body.removeChild(vLink);
  }
}

export function ZhiYunPPTInit() {
  const btnStyle = "cursor:pointer;text-decoration:underline;";
  const lineStyle = "padding:5px 0;";
  const wrap = document.createElement("div");
  wrap.style =
    "margin:0;padding:12px;width:280px;height:60vh;position:fixed;top:0;right:0;background:#fff;z-index:9999;opacity:0.8;border-left:solid 2px #008000;border-bottom:solid 2px #008000;font-size:14px;";
  const p1 = document.createElement("p");
  p1.innerText = "请待页面下载完成，视频开始播放后进行：";
  p1.style = lineStyle;

  const p2 = document.createElement("p");
  p2.innerText = "点击下载视频";
  p2.style = lineStyle + btnStyle;
  p2.addEventListener("click", downloadVideo);

  const p3 = document.createElement("p");
  p3.innerText = "";
  p3.style = lineStyle;

  wrap.appendChild(p1);
  wrap.appendChild(p2);
  wrap.appendChild(p3);
  document.body.appendChild(wrap);
}
