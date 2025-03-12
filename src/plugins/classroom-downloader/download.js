import {
  p,
  wrap_ZhiYunPPT 
  } from "./element-style";
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
  let popupEnabled=true;
  const wrap=createWrap(downloadVideo2);
  const observer=new MutationObserver(()=>appendWrap());
  startObserver(observer);
  function startObserver(observer) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function createWrap(downloadVideo){
    const wrap = document.createElement('span');
    wrap.classList.add('opr_btn' ,'collect_span');

   // 创建 SVG 元素（必须使用 createElementNS）
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('collect_icon');
    svg.style.backgroundImage='none';

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M7.29169 29.1667H27.7084V26.25H7.29169V29.1667ZM27.7084 13.125H21.875V4.375H13.125V13.125H7.29169L17.5 23.3333L27.7084 13.125Z");
    path.setAttribute("fill", "#bebebe"); 
    path.classList.add('good_icon');
    path.setAttribute('transform', 'translate(-7, -3) scale(1.05)');

    svg.appendChild(path);
    wrap.appendChild(svg);
    const text=document.createElement('span');
    text.textContent="下载视频";
    wrap.appendChild(text);
    wrap.addEventListener("click", function () {
      // 在页面加载时，检查是否需要显示 div
      chrome.storage.sync.get('showDiv', ({ showDiv }) => {
        console.log('showDiv is',showDiv);
        if (showDiv) {
          popup();
        }
        else{
          downloadVideo();
          remove();
        }
      });
  });
    return wrap;
  }
  function appendWrap(){
    const collect_div=document.querySelector('.collect');
    if(collect_div){
    collect_div.appendChild(wrap);
    console.log('success');
    observer.disconnect();
    }
    else console.log('fail to append');
  }
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
  function popup() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      #copyright-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 800px;
        width: 90%;
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        font-family: 'Microsoft YaHei', sans-serif;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      }
      .check-item { 
        margin-bottom: 15px; 
        color: #666;
      }
      .list-item { margin-bottom: 8px; }
    `;
    document.head.appendChild(style);
    
    // 创建模态框
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const modal = document.createElement('div');
    modal.id = 'copyright-modal';
    // 完整内容
    modal.innerHTML = `
      <h1 style="text-align: center; color: #333; border-bottom: 2px solid #eee; padding-bottom: 15px;">版权声明及使用协议</h1>
      
      <div style="margin: 25px 0;">
        <h2 style="color: #d32f2f; margin-bottom: 15px;">一、版权声明</h2>
        <p style="line-height: 1.6; margin-bottom: 15px; color: #666;">
          1. 本平台所有课程资源（含视频回放、语音文本、课件资料等）均受著作权法保护，版权归属原内容创作者/版权方所有。
        </p>
        <p style="line-height: 1.6; margin-bottom: 15px; color: #666;">
          2. 通过本插件获取的下载链接及文件仅限个人学习研究用途，禁止以下行为：
        </p>
        <ul style="margin-left: 30px; color: #666; list-style-type: '- ';">
          <li class="list-item">将下载内容用于商业目的（包括但不限于销售、培训、直播等）</li>
          <li class="list-item">通过互联网公开传播、分发或二次上传至其他平台</li>
          <li class="list-item">对下载内容进行篡改、去除版权标识等非法修改</li>
          <li class="list-item">将下载文件用于逆向工程、数据挖掘等非法技术分析</li>
          <li class="list-item">其他违反中华人民共和国法律法规的行为</li>
        </ul>
      </div>
    
      <div style="margin: 25px 0;">
        <h2 style="color: #d32f2f; margin-bottom: 15px;">二、使用承诺</h2>
        <div style="margin-left: 20px;">
          <label class="check-item">
            <input type="checkbox" class="agree-check"> 不会将下载内容用于侵害他人知识产权的行为
          </label>
          <br>
          <label class="check-item">
            <input type="checkbox" class="agree-check"> 如因不当使用引发法律纠纷，将自行承担全部责任
          </label>
          
        </div>
      </div>
    
      <div style="text-align: center; margin-top: 30px;">
        <button id="popupDownloadBtn" disabled>同意并继续下载</button>
        <button id="cancelBtn">取消下载</button>
      </div>
    
    `;
    
    // 添加到页面
    if(popupEnabled){
      document.body.append(overlay, modal);
    console.log('添加popup');
    // 按钮样式配置
    const btnStyle = {
      padding: '12px 35px',
      borderRadius: '4px',
      margin: '0 10px',
      cursor: 'pointer',
      border: 'none'
    };
    
    // 应用按钮样式
    const popupDownloadBtn = document.getElementById('popupDownloadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    Object.assign(popupDownloadBtn.style, btnStyle, {
      backgroundColor: '#ccc',
      color: 'white'
    });
    
    Object.assign(cancelBtn.style, btnStyle, {
      backgroundColor: 'white',
      color: '#666',
      border: '1px solid #ddd'
    });
    
    // 复选框逻辑
    const checks = [...document.querySelectorAll('.agree-check')];
    
    checks.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const allChecked = checks.every(c => c.checked);
        popupDownloadBtn.disabled = !allChecked;
        popupDownloadBtn.style.backgroundColor = allChecked ? '#2196F3' : '#ccc';
        popupDownloadBtn.style.cursor = allChecked ? 'pointer' : 'not-allowed';
      });
    });
     
    popupDownloadBtn.addEventListener('click',()=>{
    wrap.removeEventListener('click',()=>{
        // 在页面加载时，检查是否需要显示 div
        chrome.storage.sync.get('showDiv', ({ showDiv }) => {
          console.log('showDiv is',showDiv);
          if (showDiv) {
            popup();
          }
          else{
            downloadVideo();
            remove();
          }
        });
    })
    wrap.addEventListener('click',()=> {
      downloadVideo();
      remove(); 
    });
    console.log('p2监听器已更换');
    popupEnabled=false;
    remove();
    chrome.runtime.sendMessage({
      action: 'setShowDiv',
      value: false
    });
    });
    cancelBtn.addEventListener('click', () => remove());
    }
    else{
      console.log('succeed to ban popup');
    }
   
    
  }
   // 取消按钮事件
  function remove(){
    const modal=document.querySelector('#copyright-modal');
    const overlay=document.querySelector('.overlay');
    if(overlay){
      overlay.remove();
    console.log('remove the overlay');
    }
    else{
      console.log('fail to remove overlay');
    }
    if (modal) {
      modal.remove();
      console.log('remove the modal');
    }
    else{
      console.log('fail to remove modal');
    }
  }
}

export function ZhiYunPPTInit() {
  let popupEnabled=true;
  const wrap=createWrap(wrap_ZhiYunPPT,downloadVideo);
  const observer=new MutationObserver(()=>appendWrap());
  startObserver(observer);
  function startObserver(observer) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function createWrap(import_wrap,downloadVideo){
    const wrap = import_wrap;
    p.id='downloadP';
   // 创建 SVG 元素（必须使用 createElementNS）
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 15 15"); // 与 Figma 导出一致
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // 原始路径数据
    const originalPath = "M27.2917 33.1667H47.7084V30.25H27.2917V33.1667ZM47.7084 17.125H41.875V8.375H33.125V17.125H27.2917L37.5 27.3333L47.7084 17.125Z";

    // 缩放路径坐标（按比例 0.3 缩放）
    const scaledPath = originalPath.replace(/(\d+(\.\d+)?)/g, (match) => {
      return (parseFloat(match) * 0.6).toFixed(4); // 缩放每个数字并保留四位小数
    });
    path.setAttribute("d", scaledPath);
    path.setAttribute("fill", "#00479D"); 
    svg.appendChild(path);
    svg.style.padding='5px';
    svg.style.paddingRight='8px';
    svg.style.paddingTop='2px';
    p.appendChild(svg);

    const text=document.createElement('span');
    text.textContent="下载视频";
    text.style.font='16px';
    text.style.paddingLeft='10px';
    text.style.position='relative';
    text.style.bottom='5px';
    text.style.left='5px';
    text.style.color='#2c3e50';
    text.style.fontFamily='PingFang SC-Medium, PingFang SC';
    p.appendChild(text);

    p.style.paddingTop='20px';
    p.addEventListener("click", function () {
      // 在页面加载时，检查是否需要显示 div
      chrome.storage.sync.get('showDiv', ({ showDiv }) => {
        console.log('showDiv is',showDiv);
        if (showDiv) {
          popup();
        }
        else{
          downloadVideo();
          remove();
        }
      });
  });
    wrap.appendChild(p);
    return wrap;
  }
  function appendWrap(){
    const header_info=document.querySelector('.header-info');
    const operate_wrap=document.querySelector('.operate_wrap');
    if(header_info){
    header_info.insertBefore(wrap,operate_wrap);
    console.log('success');
    observer.disconnect();
    }
    else console.log('fail to append');
  }
  function downloadVideo() {
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
  function popup() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      #copyright-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 800px;
        width: 90%;
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        font-family: 'Microsoft YaHei', sans-serif;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      }
      .check-item { 
        margin-bottom: 15px; 
        color: #666;
      }
      .list-item { margin-bottom: 8px; }
    `;
    document.head.appendChild(style);
    
    // 创建模态框
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const modal = document.createElement('div');
    modal.id = 'copyright-modal';
    // 完整内容
    modal.innerHTML = `
      <h1 style="text-align: center; color: #333; border-bottom: 2px solid #eee; padding-bottom: 15px;">版权声明及使用协议</h1>
      
      <div style="margin: 25px 0;">
        <h2 style="color: #d32f2f; margin-bottom: 15px;">一、版权声明</h2>
        <p style="line-height: 1.6; margin-bottom: 15px; color: #666;">
          1. 本平台所有课程资源（含视频回放、语音文本、课件资料等）均受著作权法保护，版权归属原内容创作者/版权方所有。
        </p>
        <p style="line-height: 1.6; margin-bottom: 15px; color: #666;">
          2. 通过本插件获取的下载链接及文件仅限个人学习研究用途，禁止以下行为：
        </p>
        <ul style="margin-left: 30px; color: #666; list-style-type: '- ';">
          <li class="list-item">将下载内容用于商业目的（包括但不限于销售、培训、直播等）</li>
          <li class="list-item">通过互联网公开传播、分发或二次上传至其他平台</li>
          <li class="list-item">对下载内容进行篡改、去除版权标识等非法修改</li>
          <li class="list-item">将下载文件用于逆向工程、数据挖掘等非法技术分析</li>
          <li class="list-item">其他违反中华人民共和国法律法规的行为</li>
        </ul>
      </div>
    
      <div style="margin: 25px 0;">
        <h2 style="color: #d32f2f; margin-bottom: 15px;">二、使用承诺</h2>
        <div style="margin-left: 20px;">
          <label class="check-item">
            <input type="checkbox" class="agree-check"> 不会将下载内容用于侵害他人知识产权的行为
          </label>
          <br>
          <label class="check-item">
            <input type="checkbox" class="agree-check"> 如因不当使用引发法律纠纷，将自行承担全部责任
          </label>
          
        </div>
      </div>
    
      <div style="text-align: center; margin-top: 30px;">
        <button id="popupDownloadBtn" disabled>同意并继续下载</button>
        <button id="cancelBtn">取消下载</button>
      </div>
    
    `;
    
    // 添加到页面
    if(popupEnabled){
      document.body.append(overlay, modal);
    console.log('添加popup');
    // 按钮样式配置
    const btnStyle = {
      padding: '12px 35px',
      borderRadius: '4px',
      margin: '0 10px',
      cursor: 'pointer',
      border: 'none'
    };
    
    // 应用按钮样式
    const popupDownloadBtn = document.getElementById('popupDownloadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    Object.assign(popupDownloadBtn.style, btnStyle, {
      backgroundColor: '#ccc',
      color: 'white'
    });
    
    Object.assign(cancelBtn.style, btnStyle, {
      backgroundColor: 'white',
      color: '#666',
      border: '1px solid #ddd'
    });
    
    // 复选框逻辑
    const checks = [...document.querySelectorAll('.agree-check')];
    
    checks.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const allChecked = checks.every(c => c.checked);
        popupDownloadBtn.disabled = !allChecked;
        popupDownloadBtn.style.backgroundColor = allChecked ? '#2196F3' : '#ccc';
        popupDownloadBtn.style.cursor = allChecked ? 'pointer' : 'not-allowed';
      });
    });
     
    popupDownloadBtn.addEventListener('click',()=>{
    p.removeEventListener('click',()=>{
        // 在页面加载时，检查是否需要显示 div
        chrome.storage.sync.get('showDiv', ({ showDiv }) => {
          console.log('showDiv is',showDiv);
          if (showDiv) {
            popup();
          }
          else{
            downloadVideo();
            remove();
          }
        });
    })
    p.addEventListener('click',()=> {
      downloadVideo();
      remove(); 
    });
    console.log('p监听器已更换');
    popupEnabled=false;
    remove();
    chrome.runtime.sendMessage({
      action: 'setShowDiv',
      value: false
    });
    });
    cancelBtn.addEventListener('click', () => remove());
    }
    else{
      console.log('succeed to ban popup');
    }
   
    
  }
   // 取消按钮事件
  function remove(){
    const modal=document.querySelector('#copyright-modal');
    const overlay=document.querySelector('.overlay');
    if(overlay){
      overlay.remove();
    console.log('remove the overlay');
    }
    else{
      console.log('fail to remove overlay');
    }
    if (modal) {
      modal.remove();
      console.log('remove the modal');
    }
    else{
      console.log('fail to remove modal');
    }
  }
}
