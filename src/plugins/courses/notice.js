export let noticeState = 0;

export function noticePop() {
  // 检查 localStorage 中的状态
  if (localStorage.getItem('noticeConfirmed') === 'true') {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    //弹窗文本及样式(有点丑陋)
    const style = document.createElement('style');
    style.textContent = `
      #noticeHTML {
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
        z-index: 1009;
        font-family: 'Microsoft YaHei', sans-serif;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1006;
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
    modal.id = 'noticeHTML';

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
            <input type="checkbox" id="agree1"> 不会将下载内容用于侵害他人知识产权的行为
          </label>
          <br>
          <label class="check-item">
            <input type="checkbox" id="agree2"> 如因不当使用引发法律纠纷，将自行承担全部责任
          </label>
          
        </div>
      </div>
    
      <div style="text-align: center; margin-top: 30px;">
      <label class="check-item">
            <input type="checkbox"  id='showDivCheckbox' > 下次不再提示
          </label>
        <button id="popupDownloadBtn" disabled>同意并继续下载</button>
        <button id="cancelBtn">取消下载</button>
      </div>
    
    `;
    // 添加到页面
    document.body.append(overlay, modal);
    // 按钮样式配置
    const btnStyle = {
      padding: '12px 35px',
      borderRadius: '4px',
      margin: '0 10px',
      cursor: 'pointer',
      border: 'none',
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
    //实现强制勾选模式功能与不再提示功能
    const agree1 = document.getElementById('agree1');
    const agree2 = document.getElementById('agree2');
    const showDivCheckbox = document.getElementById('showDivCheckbox');

    // 监听复选框的变化，启用或禁用继续按钮
    function popupDownloadBtnState() {
      popupDownloadBtn.disabled = !(agree1.checked && agree2.checked);
      if(agree1.checked && agree2.checked){
        popupDownloadBtn.style.backgroundColor = '#2196f3';
      }else{
        popupDownloadBtn.style.backgroundColor = '#ccc';
      }
    }
    agree1.addEventListener('change', popupDownloadBtnState);
    agree2.addEventListener('change', popupDownloadBtnState);

    // 监听“不再提示”复选框的状态
    showDivCheckbox.addEventListener('change', () => {
      chrome.runtime.sendMessage({
        action: 'setShowDiv',
        value: !showDivCheckbox.checked
      });
      noticeState = showDivCheckbox.checked ? 1 : 0;
    });

    // 监听继续按钮的点击事件
    popupDownloadBtn.addEventListener('click', () => {
      if (agree1.checked && agree2.checked) {
        if (showDivCheckbox.checked) {
          localStorage.setItem('noticeConfirmed', 'true');
        }
        removeDiv();
        resolve(true);
      } else {
        alert('请勾选所有选项后再继续');
      }
    });

    // 监听取消按钮的点击事件
    cancelBtn.addEventListener('click', () => {
      removeDiv();
      noticeState = 0;
      resolve(false);
    });
  });
}

// 移除 div
function removeDiv() {
  const div = document.getElementById('noticeHTML');
  if (div) {
    div.remove();
  }
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}
