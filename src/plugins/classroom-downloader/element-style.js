function createElement(tag, config = {}) {
  const element = document.createElement(tag);
  // 设置属性
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  // 设置样式
  if (config.styles) {
    Object.assign(element.style, config.styles);
  }
  
  // 设置内容
  if (config.text) element.textContent = config.text;
  if (config.html) element.innerHTML = config.html;
  if (config.innerText) element.innerText = config.innerText;
  // 设置类名
  if (config.className) element.className = config.className;
  if (config.classList) element.classList.add(...config.classList);
  
  // 添加事件监听器
  if (config.events) {
    Object.entries(config.events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  }
  
  return element;
}

export const wrap_interactivemeta = createElement("div",{
  attributes: { id: "interactivemeta_wrap" },
  styles: {
    margin:'0',
    padding: '5px',
    width: '10px',
    height: '20px',
    background: '#fff',
    zIndex: 'auto',
    opacity: '0.8',
  }
});

export const wrap_ZhiYunPPT = createElement("div",{
  attributes: { id: "ZhiYunPPT_wrap" },
  styles: {
    margin: '0',
    padding: '5px',
    width: '10px',
    height: '20px',
    zIndex: 'auto',
    opacity: '0.8',
  }
});

export const p = createElement("p",{
  styles:{
    cursor: 'pointer',
    textDecoration: 'none'
  }
});

export const container = createElement('div',{
  attributes:{id: 'batch-container'},
  styles:{
    position:'fixed',
    bottom:'10px',
    right:'10px',
    backgroundColor:'white',
    padding:'15px',
    border:'1px solid #ccc',
    zIndex: 9999,
    maxHeight: '30%',
    overflowY: 'auto',
    fontSize: '14px',
    lineHeight: '1.5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    minWidth: '18%',
    maxWidth: '50%',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    flexDirection: 'column'
  }  
});

export const header = createElement("div",{
  classList: ['header'],
  styles: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'default',
    marginBottom: '12px',
  }
});

export const title = createElement('div',{
  classList:['title'],
  innerText:'批量下载视频',
  styles:{
    fontWeight:'bold',
    color:'black',
    textDecoration:'none',
    borderBottom:'none',
    padding:'0px'
  }
});

export const minimizeButton = createElement("button",{
  classList:['minimizeButton'],
  styles:{
    boder: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    padding: '0',
  }
});

export const selectAllContainer = createElement("div",{
  classList:['selectAllContainer'],
  styles:{
    display:'flex',
    alignItems:'center',
    justifyContent:'space-bewteen',
    marginBottom:'10px'
  }
});

export const reminder = createElement("span",{
  classList:['reminder'],
  innerText:'关闭页面即可停止下载',
  styles:{
    display:'none',
    marginLeft:'5%'
  }
});

export const selectAllCheckbox = createElement("input",{
  attributes:{
    id:'selectAllCheckbox',
    type:'checkbox'
  },
});
export  const selectAllLabel = createElement("label",{
  innerText:'全选',
  attributes:{for:'selectAllCheckbox'}
});

export const downloadButton = createElement("button",{
  innerText: "下载选中视频",
  attributes:{id:'downloadBtn'},
  styles: {
    display: 'block',
    marginTop: '10px',
    width: '100%',
    padding: '8px',
    backgroundColor: 'rgba(0,71,157,255)',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '14px',
  }
});

export const status = createElement("div",{
  styles:{
    marginTop: '10px',
    fontSize: '12px',
    color: '#555',
    display: 'none', // 初始隐藏
  },
  classList: ['status']
});

export const overallProgressContainer = createElement("div",{
  classList: ['overallProgressContainer'],
  styles: {
    width: "100%",
    backgroundColor: "#f3f3f3",
    borderRadius: "5px",
    marginTop: "10px",
    display: "none" // 初始隐藏
  }
});

export const overallProgressBar = createElement("div",{
  classList: ['overallProgressBar'],
  styles: {
    width: "0%",
    height: "20px",
    backgroundColor: "#4CAF50",
    borderRadius: "5px",
    display:"none"
  }
});

export const list = createElement("ul",{
  classList: ['list'],
  styles: {
    listStyle: "none",
    padding: "0",
  }
});

export const listItem = createElement("li",{
  classList: ['listItem'],
  styles: {
    marginTop: "10px",
    display: "block",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px"
  }
});

export const headerDiv = createElement("div",{
  classList: ['headerDiv'],
  styles: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  }
});

export const progressContainer = createElement("div",{
  classList: ['progressContainer'],
  styles: {
    width: "100%",
    backgroundColor: "#f3f3f3",
    borderRadius: "5px",
    marginTop: "5px",
    display: "none" // 初始隐藏
  }
});

export const progressBar = createElement("div",{
  classList: ['progressBar'],
  styles: {
    width: "0%",
    height: "10px",
    backgroundColor: "#4CAF50",
    borderRadius: "5px"
  }
});

export const infoDiv = createElement("div",{
  classList: ['infoDiv'],
  styles: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#555",
    display: "none" // 初始隐藏
  },
  innerText: "速度: 0 KB/s | 预计剩余时间: 0 s"
});
