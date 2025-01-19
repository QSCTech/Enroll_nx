const btnStyle = "cursor:pointer;text-decoration:underline;";
const lineStyle = "padding:5px 0;";

export const wrap_interactivemeta=document.createElement('div');
    wrap_interactivemeta.style = "margin:0;padding:12px;width:200px;height:5vh;position:fixed;top:10%;right:1%;background:#fff;z-index:9999;opacity:0.8;border-left:solid 2px #008000;border-bottom:solid 2px #008000;font-size:14px;";

export const wrap_ZhiYunPPT=document.createElement('div');
    wrap_ZhiYunPPT.style="margin:0;padding:12px;width:125px;height:15vh;position:fixed;top:15%;right:0;background:#fff;z-index:9999;opacity:0.8;border-left:solid 2px #008000;border-bottom:solid 2px #008000;font-size:14px;";

export const p=document.createElement('p');
    p.innerText = '务必页面下载完成后再点击下载视频';
    p.style = lineStyle + btnStyle;


const container=document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "white";
    container.style.padding = "15px";
    container.style.border = "1px solid #ccc";
    container.style.zIndex = 9999;
    container.style.maxHeight = "80%";
    container.style.overflowY = "auto";
    container.style.fontSize = "14px";
    container.style.lineHeight = "1.5";
    container.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    container.style.borderRadius = "5px";
    container.style.width = "320px";
    container.style.transition = "all 0.3s ease";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    export const container_batch=container;

const header=document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.cursor = "default"; // 移除拖动功能
    header.style.marginBottom = "10px";
    export const header_batch=header;


const minimizeButton=document.createElement("button");
    minimizeButton.innerText = "—";
    minimizeButton.style.border = "none";
    minimizeButton.style.background = "none";
    minimizeButton.style.cursor = "pointer";
    minimizeButton.style.fontSize = "16px";
    minimizeButton.style.lineHeight = "1";
    minimizeButton.style.padding = "0";
    minimizeButton.style.marginLeft = "10px";
    minimizeButton.title = "最小化";
    export const minimizeButton_batch=minimizeButton;


const downloadButton=document.createElement("button");
    downloadButton.innerText = "下载选中视频";
    downloadButton.style.display = "block";
    downloadButton.style.marginTop = "10px";
    downloadButton.style.width = "100%";
    downloadButton.style.padding = "8px";
    downloadButton.style.backgroundColor = "#4CAF50";
    downloadButton.style.color = "white";
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "3px";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.fontSize = "14px";
    export const downloadButton_batch=downloadButton;


const status = document.createElement("div");
    status.style.marginTop = "10px";
    status.style.fontSize = "12px";
    status.style.color = "#555";
    export const status_batch=status;


const overallProgressContainer = document.createElement("div");
    overallProgressContainer.style.width = "100%";
    overallProgressContainer.style.backgroundColor = "#f3f3f3";
    overallProgressContainer.style.borderRadius = "5px";
    overallProgressContainer.style.marginTop = "10px";
    overallProgressContainer.style.display = "none"; // 初始隐藏
    export const overallProgressContainer_batch=overallProgressContainer;


const overallProgressBar = document.createElement("div");
    overallProgressBar.style.width = "0%";
    overallProgressBar.style.height = "20px";
    overallProgressBar.style.backgroundColor = "#4CAF50";
    overallProgressBar.style.borderRadius = "5px";
    export const overallProgressBar_batch=overallProgressBar;


const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.marginTop = "10px";
    export const list_batch=list;


const listItem = document.createElement("li");
    listItem.style.marginTop = "10px";
    listItem.style.display = "block";
    listItem.style.borderBottom = "1px solid #ddd";
    listItem.style.paddingBottom = "10px";
    export const listItem_batch=listItem;


const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.alignItems = "center";
    export const headerDiv_batch=headerDiv;
    

const progressContainer = document.createElement("div");
    progressContainer.style.width = "100%";
    progressContainer.style.backgroundColor = "#f3f3f3";
    progressContainer.style.borderRadius = "5px";
    progressContainer.style.marginTop = "5px";
    progressContainer.style.display = "none"; // 初始隐藏
    export const progressContainer_batch=progressContainer;
    

const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "10px";
    progressBar.style.backgroundColor = "#4CAF50";
    progressBar.style.borderRadius = "5px";
    export const progressBar_batch=progressBar;
   

const infoDiv = document.createElement("div");
    infoDiv.style.marginTop = "5px";
    infoDiv.style.fontSize = "12px";
    infoDiv.style.color = "#555";
    infoDiv.style.display = "none"; // 初始隐藏
    infoDiv.innerText = "速度: 0 KB/s | 预计剩余时间: 0 s";
    export const infoDiv_batch=infoDiv;
    
   
