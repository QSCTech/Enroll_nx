import { wrap_interactivemeta,p,wrap_ZhiYunPPT } from "./element-style";
export function downloadVideo() {
  const courseName =document.getElementsByClassName("course_name")[0].innerText;
  const videoSrc = document.getElementById("cmc_player_video").src;
  const vLink = document.createElement("a");
  vLink.href = videoSrc;
  vLink.target = "_blank";
  vLink.download = courseName ? courseName : "ZhiYunPPT";
  document.body.appendChild(vLink);
  vLink.click();
  document.body.removeChild(vLink);
}

export function interactivemetaInit(){
  const wrap=wrap_interactivemeta;
  

  const p1 = p;
  p1.addEventListener('click',downloadVideo2);
  p1.innerText = '务必页面下载完成后再点击下载视频';
  wrap.appendChild(p1);
  document.body.appendChild(wrap);

  function downloadVideo2(){
    const courseName = '';
    const videoSrc = document.getElementById('cmc_player_video').src;
    const vLink = document.createElement('a');
    vLink.href = videoSrc;
    vLink.target = '_blank';
    vLink.download = (courseName?courseName:'ZhiYunPPT');
    document.body.appendChild(vLink);
    vLink.click();
    document.body.removeChild(vLink);
  }
}

export function ZhiYunPPTInit(){
  const wrap=wrap_ZhiYunPPT;
  const p1=document.createElement("p");
  p1.style="padding:5px 0;";
  p1.innerText="请视频开始正常播放后：";

  const p2 = p;
  p2.innerText="点击下载视频";
  p2.addEventListener('click',downloadVideo);
  
  wrap.appendChild(p1);
  wrap.appendChild(p2);
  document.body.appendChild(wrap);
  
  function downloadVideo(){
    const courseName = document.getElementsByClassName("course_name")[0].innerText;
    const videoSrc = document.getElementById('cmc_player_video').src;
    const vLink = document.createElement('a');
    vLink.href = videoSrc;
    vLink.target = '_blank';
    vLink.download = (courseName?courseName:'ZhiYunPPT');
    document.body.appendChild(vLink);
    vLink.click();
    document.body.removeChild(vLink);
  
  }
}
