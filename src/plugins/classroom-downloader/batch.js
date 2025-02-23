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
          // 在页面加载时，检查是否需要显示 div
          chrome.storage.sync.get('showDiv', ({ showDiv }) => {
            console.log(showDiv);
            if (showDiv) {
              popup();
              checkboxSwitch(0);
            }
            else{
              checkboxSwitch(1);
            }
          });
        } else {
          console.log("从API获取数据失败，数据结构不符合预期");
        }
      })
      .catch((error) => {
        console.log("Error fetching API:", error);
      });
    function addDownloadUI(videos) {
      console.log("正在添加批量下载的用户界面");
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
        console.log(video);
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
            console.log(videoObj);
            const video = videoObj.video;
            console.log(video);
            const { listItem, progressBar, infoDiv } = video.domRef;
            console.log(videoObj.dom);
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
      });
    }
    function checkboxSwitch(flag){
      //flag为1，使checkbox可选；flag为0，使checkbox不可选
      const container=document.querySelector('#batch-container');
      if(container){
        if(flag===0){
          const checkboxes = container.querySelectorAll(".videoCheckbox");
          if(checkboxes){
            checkboxes.forEach((cb) => {
              if (!cb.disabled) {
                cb.disabled=true;
              }
            });
            console.log("checkboxes复选框已全部被禁止点击"); 
          }else{
            console.log('fail to get checkboxes');
          }
        }
        else if(flag===1){
          const checkboxes = container.querySelectorAll(".videoCheckbox");
          if(checkboxes){
            checkboxes.forEach((cb) => {
              if (cb.disabled) {
                cb.disabled=false;
              }
            });
            console.log("checkboxes复选框已全部允许点击"); 
          }else{
            console.log('fail to get checkboxes');
          }
        }
        else{
          console.log('flag类型错误');
          return ;
        }
      }
      else{
        console.log('fail to get batch-container');
        return;
      }
    }
    function popup() {
      // 插入弹窗到页面中
    const popupHTML = `
    <div id="copyright-declaration-div" style="position: fixed; top: 20px; right: 20px; background: white; padding: 20px; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); z-index: 1000;">
      <label><input type="checkbox" id="enable-download-checkbox"> 我已阅读并承诺依法行事</label><br>
      <label><input type="checkbox" id="dont-show-again-checkbox"> 不再提示</label>
      <button id="continue-btn"> 继续下载</button>
    </div>
    `;
      document.body.insertAdjacentHTML('beforeend', popupHTML);
      const enableDownloadCheckbox = document.getElementById('enable-download-checkbox');
      const dontShowAgainCheckbox = document.getElementById('dont-show-again-checkbox');
      const continueBtn=document.getElementById("continue-btn");
      // 监听“启用下载”复选框的状态
      // enableDownloadCheckbox.addEventListener('change', () => {
      //   if (enableDownloadCheckbox.checked) {
      //     // 启用下载功能
      //     checkboxSwitch(1);
      //   }
      //   else{
      //     checkboxSwitch(0);
      //   }
      // });

      // 监听“不再提示”复选框的状态
      dontShowAgainCheckbox.addEventListener('change', () => {
        if (dontShowAgainCheckbox.checked) {
          chrome.runtime.sendMessage({
            action: 'setShowDiv',
            value: false
          });
        }
        else{
          chrome.runtime.sendMessage({
            action: 'setShowDiv',
            value: ture
          });
        }
      }); 
      continueBtn.addEventListener('click',()=>{
        if(enableDownloadCheckbox.checked){
          checkboxSwitch(1);
          removeDiv();
        }
        else{
          alert("请同意声明，否则无法下载视频");
        }
      })
    }
    // 移除 div
    function removeDiv() {
      const div = document.getElementById('copyright-declaration-div');
      if (div) {
        div.remove();
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
