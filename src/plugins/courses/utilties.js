
export function watch(targetNode,config,filter,wantList)//在元素上创建监听事件
{// 元素监听器：https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
    let callback = function (mutationsList, observer) {
        if (wantList) filter(mutationsList);
        else mutationsList.forEach(filter);
    };
    let observer = new MutationObserver(callback);// 创建一个观察器实例并传入回调函数
    observer.observe(targetNode, config);// 以上述配置开始观察目标节点 
    return observer;
}
export function wait_element(params)//params= {getter, callback,watchOn,recurive }
{//https://stackoverflow.com/questions/38881301/observe-mutations-on-a-target-node-that-doesnt-exist-yet/38882022#38882022
    var el = params.getter();
    if (el) {//already  existed
        params.callback(el);
        return;
    }
    if (!params.recursive) params.recursive = false;
    return new MutationObserver(function (mutations) {
        var el = params.getter();
        if (el) {
            this.disconnect();
            params.callback(el);
        }
    }).observe(params.watchOn || document, {
        subtree: !!params.recursive || !params.watchOn,
        childList: true,
    });
}
export function insert_after(newElement,targetElement) {
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}
export function extract_filename(fileSrc)
{//get file actual extension name
    var filename;
    try {
        var reg = /&name=(.*)/;
        filename = reg.exec(fileSrc)[1];//正则匹配链接中的文件名
        filename = decodeURIComponent(filename);
    } catch (e)//failed,raw name
    {
        try {//parse filename from url
            var pathlist = new URL(fileSrc).pathname.split('/')
            filename = pathlist[pathlist.length - 1];
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    return filename;
}//end extract_filename

//支持进度条的前端下载
function trackDownloadingOnXHR(url, filename, progress_callback, complete_callback) {
//ref:https://javascript.info/fetch-progress#post-5182759778
    //param @progress_callback(computable,loaded,total)
    //param @complete_callback(success,status,statusText)
	let xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.open("GET", url);

	xhr.onprogress = (e) => {
		progress_callback(e.lengthComputable,e.loaded, e.total);
    };
    var oldReadyState = xhr.readyState;
    xhr.onreadystatechange = () => {
        if (xhr.readyState == oldReadyState) return;
        console.log('readyState', xhr.readyState, xhr.status);
        oldReadyState = xhr.readyState;
    }
    xhr.onerror = (e) => complete_callback(false, xhr.status, xhr.statusText);
    // xhr.onabort = (e) => complete_callback(false, xhr.status, xhr.statusText);
	xhr.onload = () => {
		if (xhr.status != 200) {
			console.error(`下载失败 ${xhr.status}: ${xhr.statusText}`);
		} else {//success
			let res = xhr.response;
			let blob = new Blob([res], {
				type: "application/octet-stream",
				"Content-Disposition": "attachment",
			});
			let link = window.URL.createObjectURL(blob);
			let a = document.createElement("a");
			a.href = link;
			a.download = filename;
			a.click();
			a.remove();
			window.URL.revokeObjectURL(link);//释放对象避免内存泄露
		}
		complete_callback(xhr.status == 200,xhr.status,xhr.statusText);
	};
    xhr.send();
    return xhr;
}

export function set_download_btn(btn,url,fname,idle_class,downloading_class)
{//为一个按钮绑定下载功能
//两种状态：idle, downloading
    console.log('set download btn', btn);
    let originText = btn.innerText;
    function to_idle() {
        console.log('idle');
        btn.innerText = originText;
        btn.setAttribute('class',idle_class)
        btn.onclick = idle_onclick;
    }
    function to_downloading(xhr) {
        console.log('downloading');
        function downloading_onclick(e) {
            xhr.abort();
            to_idle();
            console.log('download abort');
        }
        btn.setAttribute('class', downloading_class);
        btn.onclick = downloading_onclick;
    }

    function complete(success,status,msg) {
        if (!success) {
            alert(`[zju-webx]: 下载失败！code ${status} ${msg}`);
        }
        else console.log('download complete');
        //enter idle
        to_idle();
    }
    function idle_onclick(e) {
        function pcallback(computable, loaded, total)
        {
            if (computable) {
                let oneMB = 1048576;
                btn.innerText = `下载中...${(loaded / oneMB).toFixed(2)}MB/${(total / oneMB).toFixed(2)}MB`;
            }
            else {
                btn.innerText = `下载中...`;
            }
        }
        //enter downloading
        let xhr = trackDownloadingOnXHR(url, fname, pcallback, complete);
        to_downloading(xhr);
        pcallback(false, 0, 0);
    }
    to_idle();//初始化绑定
}