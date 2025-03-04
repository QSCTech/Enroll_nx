import {
  container_batch,
  header_batch,
  minimizeButton_batch,
  downloadButton_batch,
  status_batch,
  overallProgressContainer_batch,
  overallProgressBar_batch,
  list_batch,
  listItem_batch,
  headerDiv_batch,
  progressContainer_batch,
  progressBar_batch,
  infoDiv_batch,
} from "./element-style";
export default () => {
  // 获取URL中的参数
  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  }
  (function () {
    "use strict";

    console.log("智云课堂批量下载脚本已启动");
    const course_id = getQueryVariable("course_id");
    if (!course_id) {
      console.log("course_id not found");
      return;
    }
    console.log(`课程ID: ${course_id}`);

    // CORS代理前缀（如果需要）
    const corsProxy = ""; // 例如 'https://cors-anywhere.herokuapp.com/'
    // 调用API获取课程目录
    const apiUrl = `https://classroom.zju.edu.cn/courseapi/v2/course/catalogue?course_id=${course_id}`;
    console.log(`API URL: ${apiUrl}`);
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // 根据需要添加 credentials: 'include'
    })
      .then((response) => {
        console.log("API响应状态:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("API响应数据:", data);
        if (data.success && data.result && data.result.data) {
          const items = data.result.data;
          console.log(`获取到的课程目录项数量: ${items.length}`);
          // 处理每个视频项
          const videos = [];
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let title = item.title;
            let videoUrl = null;
            let available = true;

            //if (item.pic) {
            try {
              const contentData = JSON.parse(item.content);
              console.log(`解析第${i + 1}项的content字段成功`);

              if (contentData.playback && contentData.playback.url) {
                videoUrl = contentData.playback.url;
                console.log(`第${i + 1}项视频URL: ${videoUrl}`);
              } else if (contentData.url) {
                // 处理直接在"url"字段中的情况
                videoUrl = contentData.url;
                console.log(`第${i + 1}项视频URL: ${videoUrl}`);
              } else {
                available = false;
                console.log(`第${i + 1}项没有可用的视频URL`);
              }
            } catch (e) {
              console.error(`解析第${i + 1}项的content字段失败:`, e);
              available = false;
            }
            //} else {
            //    available = false;
            //    console.log(`第${i + 1}项的pic字段为空，标记为暂无回放`);
            //}

            // 如果pic为空或videoUrl未获取到，则标记为暂无回放
            if (!available || !videoUrl) {
              title += "（暂无回放）";
            }

            videos.push({
              title: title,
              videoUrl: videoUrl,
              available: available,
              originalIndex: i,
            });
          }

          console.log(
            `可下载的视频数量: ${videos.filter((v) => v.available).length}`
          );
          // 添加批量下载界面
          
          addDownloadUI(videos);
        } else {
          console.log("从API获取数据失败，数据结构不符合预期");
        }
      })
      .catch((error) => {
        console.log("Error fetching API:", error);
      });
    function addDownloadUI(videos) {
      console.log("正在添加批量下载的用户界面");
      let popupEnabled=true;
      // 创建容器
      const container = container_batch;

      // 创建标题和最小化按钮
      const header = header_batch;

      const title = document.createElement("div");
      title.style.fontWeight = "bold";
      title.innerText = "批量下载视频";
      header.appendChild(title);

      const minimizeButton = minimizeButton_batch;

      minimizeButton.addEventListener("click", () => {
        if (container.classList.contains("minimized")) {
          // 恢复窗口
          container.classList.remove("minimized");
          // 显示所有相关元素
          selectAllContainer.style.display = "flex";
          downloadButton.style.display = "block";
          overallProgressContainer.style.display = "block";
          status.style.display = "block";
          list.style.display = "block";
          minimizeButton.innerText = "—";
          minimizeButton.title = "最小化";
          console.log("恢复下载界面");
        } else {
          // 最小化窗口
          container.classList.add("minimized");
          // 隐藏所有相关元素
          selectAllContainer.style.display = "none";
          downloadButton.style.display = "none";
          overallProgressContainer.style.display = "none";
          status.style.display = "none";
          list.style.display = "none";
          minimizeButton.innerText = "+";
          minimizeButton.title = "恢复";
          console.log("最小化下载界面");
        }
      });

      header.appendChild(minimizeButton);
      container.appendChild(header);

      // 创建全选复选框容器
      const selectAllContainer = document.createElement("div");
      selectAllContainer.style.display = "flex";
      selectAllContainer.style.alignItems = "center";
      selectAllContainer.style.marginBottom = "10px";

      const selectAllCheckbox = document.createElement("input");
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.id = "selectAllCheckbox";

      const selectAllLabel = document.createElement("label");
      selectAllLabel.htmlFor = "selectAllCheckbox";
      selectAllLabel.innerText = " 全选";

      selectAllContainer.appendChild(selectAllCheckbox);
      selectAllContainer.appendChild(selectAllLabel);
      container.appendChild(selectAllContainer);

      // 创建下载按钮
      const downloadButton = downloadButton_batch;
      downloadButton.id='downloadBtn';
      downloadButton.addEventListener("mouseover", () => {
        if (!downloadButton.disabled) {
          downloadButton.style.backgroundColor = "#45a049";
        }
      });
      downloadButton.addEventListener("mouseout", () => {
        if (!downloadButton.disabled) {
          downloadButton.style.backgroundColor = "#4CAF50";
        }
      });

      container.appendChild(downloadButton);

      // 创建状态显示区域
      const status = status_batch;
      container.appendChild(status);

      // 创建整体进度条
      const overallProgressContainer = overallProgressContainer_batch;
      container.appendChild(overallProgressContainer);
      const overallProgressBar = overallProgressBar_batch;

      // 创建列表
      const list = list_batch;
      container.appendChild(list);

      // 添加视频项
      videos.forEach((video, index) => {
        const listItem = listItem_batch;

        const headerDiv = headerDiv_batch;

        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = video.originalIndex; // 保存视频在原始数组中的索引
        checkbox.className = "videoCheckbox";
        checkbox.style.marginRight = "10px";
        if (!video.available) {
          checkbox.disabled = true;
        }

        const label = document.createElement("label");
        label.style.flex = "1";
        label.style.cursor = "pointer";
        label.innerText = video.title;

        headerDiv.appendChild(checkbox);
        headerDiv.appendChild(label);
        listItem.appendChild(headerDiv);

        // 创建进度条
        const progressContainer = progressContainer_batch;

        const progressBar = progressBar_batch;
        progressContainer.appendChild(progressBar);

        // 创建速度和时间信息
        const infoDiv = infoDiv_batch;

        listItem.appendChild(progressContainer);
        listItem.appendChild(infoDiv);

        list.appendChild(listItem);
        //保存DOM引用用作索引
        video.domRef={
          listItem,
          progressBar,
          infoDiv
        }
      });

      document.body.appendChild(container);
      console.log("批量下载界面已添加到页面");

      // 事件监听
      selectAllCheckbox.addEventListener("change", function () {
        const checkboxes = container.querySelectorAll(".videoCheckbox");
        checkboxes.forEach((cb) => {
          if (!cb.disabled) {
            cb.checked = this.checked;
          }
        });
        console.log(`全选复选框状态改变为: ${this.checked}`);
      });

      downloadButton.addEventListener("click", function () {
          // 在页面加载时，检查是否需要显示 div
          chrome.storage.sync.get('showDiv', ({ showDiv }) => {
            console.log('showDiv is',showDiv);
            if (showDiv) {
              popup();
            }
            else{
              download();
              remove();
            }
          });
      });
      function download(){
        console.log("下载按钮被点击");
        status.innerText = "开始下载...";
        selectAllCheckbox.disabled=true;
        console.log("selectAllCheckbox全选复选框已被禁止点击");
        const checkboxes = container.querySelectorAll(".videoCheckbox");
        const selectedVideos = [];
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            const videoIndex = parseInt(cb.value);
            selectedVideos.push({
              video: videos[videoIndex],
              index: videos[videoIndex].domRef
            });
          }
          cb.disabled=true;
        });
        console.log("checkboxes复选框已全部被禁止点击");
  
        if (selectedVideos.length === 0) {
          alert("请选择要下载的视频");
          status.innerText = "";
          console.log("未选择任何视频进行下载");
          return;
        }
  
        console.log(`选中的视频数量: ${selectedVideos.length}`);
        selectedVideos.forEach((videoObj, idx) => {
          console.log(
            `准备下载 (${idx + 1}/${selectedVideos.length}): ${
              videoObj.video.title
            } - ${videoObj.video.videoUrl}`
          );
        });
  
        // 禁用下载按钮并更改文本
        downloadButton.disabled = true;
        downloadButton.innerText = "下载中...";
        downloadButton.style.backgroundColor = "#888";
        downloadButton.style.cursor = "not-allowed";
        console.log("下载按钮已禁用，文本已更改为 '下载中...'");
  
        // 显示整体进度条
        overallProgressContainer.style.display = "block";
        overallProgressBar.style.width = "0%";
        console.log("显示整体进度条");
  
        let currentDownload = 0;
        let completed = 0;
  
        function downloadNext() {
          if (currentDownload < selectedVideos.length) {
            const videoObj = selectedVideos[currentDownload];
            const video = videoObj.video;
            const { listItem, progressBar, infoDiv } = video.domRef;
            const progressContainer =listItem.querySelector("div:nth-child(2)");
            if (!listItem || !progressBar || !infoDiv) {
              console.error(`错误：未找到listItem。`);
              currentDownload++;  // 跳过当前下载
              downloadNext(); // 继续下载下一个
              return;  // 如果找不到 listItem，就跳过
            }
            status.innerText = `正在下载 (${currentDownload + 1}/${
              selectedVideos.length
            }): ${video.title}`;
            console.log(
              `开始下载 (${currentDownload + 1}/${selectedVideos.length}): ${
                video.title
              } - ${video.videoUrl}`
            );
  
            progressContainer.style.display = "block";
            infoDiv.style.display = "block";
  
            // 创建 XHR 请求
            const xhr = new XMLHttpRequest();
            const downloadUrl = corsProxy + video.videoUrl;
            console.log(`下载链接: ${downloadUrl}`);
            xhr.open("GET", downloadUrl, true);
            xhr.responseType = "blob";
  
            let startTime = Date.now();
  
            // 监听进度
            xhr.onprogress = function (event) {
              if (event.lengthComputable) {
                const percentComplete = (
                  (event.loaded / event.total) *
                  100
                ).toFixed(2);
                progressBar.style.width = percentComplete + "%";
  
                // 计算下载速度和剩余时间
                const currentTime = Date.now();
                const elapsedTime = (currentTime - startTime) / 1000; // 秒
                const bytesLoaded = event.loaded;
                const speed =
                  elapsedTime > 0
                    ? (bytesLoaded / elapsedTime / 1024).toFixed(2)
                    : "0"; // KB/s
  
                const remainingBytes = event.total - event.loaded;
                const estimatedTime =
                  speed > 0 ? (remainingBytes / 1024 / speed).toFixed(2) : "0";
  
                infoDiv.innerText = `速度: ${speed} KB/s | 预计剩余时间: ${estimatedTime} s`;
  
                //console.log(`下载进度 (${video.title}): ${percentComplete}% | 速度: ${speed} KB/s | 预计剩余时间: ${estimatedTime} s`);
              }
            };
  
            // 监听完成
            xhr.onload = function () {
              if (xhr.status === 200 || xhr.status === 206) {
                const blob = xhr.response;
                const url = window.URL.createObjectURL(blob);
  
                // 创建并点击隐藏的 <a> 标签
                const a = document.createElement("a");
                a.href = url;
                a.download = sanitizeFilename(video.title) + ".mp4";
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
  
                // 释放 Blob URL
                window.URL.revokeObjectURL(url);
  
                console.log(`下载已启动 (${video.title}): ${a.download}`);
              } else {
                console.error(
                  `下载失败 (${video.title}): 状态码 ${xhr.status}`
                );
                alert(`下载失败: ${video.title} （状态码 ${xhr.status}）`);
              }
  
              completed++;
              console.log(
                `完成下载: ${video.title} (${completed}/${selectedVideos.length})`
              );
  
              // 更新整体进度条
              const progress = (
                (completed / selectedVideos.length) *
                100
              ).toFixed(2);
              overallProgressBar.style.width = progress + "%";
              console.log(`整体进度: ${progress}%`);
  
              currentDownload++;
              console.log('currentDownload is ${currentDownload}');
              // 触发下一个下载
              downloadNext();
            }
  
            // 监听错误
            xhr.onerror = function () {
              console.error(`下载失败 (${video.title}): 网络错误`);
              alert(`下载失败: ${video.title} （网络错误）`);
  
              completed++;
              console.log(
                `下载错误处理: ${video.title} (${completed}/${selectedVideos.length})`
              );
  
              // 更新整体进度条
              const progress = (
                (completed / selectedVideos.length) *
                100
              ).toFixed(2);
              overallProgressBar.style.width = progress + "%";
              console.log(`整体进度: ${progress}%`);
  
              currentDownload++;
              // 触发下一个下载
              setTimeout(downloadNext, 1000); // 1秒延迟
            };
  
            console.log(`发送XHR请求 (${video.title})`);
            xhr.send();
          } else {
            status.innerText = "所有下载已完成！请查看浏览器的下载管理器。";
            console.log("所有下载已完成");
  
            // 隐藏整体进度条
            setTimeout(() => {
              overallProgressContainer.style.display = "none";
              console.log("隐藏整体进度条");
            }, 5000);
  
            // 恢复下载按钮和复选框
            downloadButton.disabled = false;
            downloadButton.innerText = "下载选中视频";
            downloadButton.style.backgroundColor = "#4CAF50";
            downloadButton.style.cursor = "pointer";
            console.log("恢复下载按钮状态");
  
            const checkboxes = container.querySelectorAll(".videoCheckbox");
            checkboxes.forEach((cb) => {
              cb.disabled=false;
            });
            selectAllCheckbox.disabled=false;
          }
        }
  
        downloadNext();
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
          
          const showDivCheckbox=document.querySelector('#showDivCheckbox');
          
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
            downloadButton.removeEventListener('click',()=>{
                // 在页面加载时，检查是否需要显示 div
                chrome.storage.sync.get('showDiv', ({ showDiv }) => {
                  console.log('showDiv is',showDiv);
                  if (showDiv) {
                    popup();
                  }
                  else{
                    download();
                    remove();
                  }
                });
            })
            downloadButton.addEventListener('click',()=> {
              download();
              remove(); 
            });
            console.log('下载按钮监听器已更换');
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
      function checkboxSwitch(flag){
        const checkboxes = container.querySelectorAll(".videoCheckbox");
        if (checkboxes) {
          if(flag!==1 && flag!==0){
            console.log('参数错误');
            return;
          }
          else{
            checkboxes.forEach((cb)=>{
              cb.disabled=(flag===1) ? false: true;
            })
          }
        } else {
          console.log('fail to get the checkboxex for downloading');
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
    

    /**
     * 去除文件名中的非法字符
     * @param {string} name - 原始文件名
     * @returns {string} - 安全的文件名
     */
    function sanitizeFilename(name) {
      return name.replace(/[\/\\:*?"<>|]/g, "_");
    }
  })();
};