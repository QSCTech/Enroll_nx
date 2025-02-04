
//----------------zdbk教学信息服务平台-----------------------
import {set_download_btn,extract_filename,wait_element,insert_after,watch} from "./utilties"
const webxConfig = {
    runAsBookmark:false,
    theme :{//一些主题颜色设置
        mainColor:'#003f88',//浙大蓝
        bgColor:'#BAD4EA',//教务网背景浅蓝
    } 
}
export function zdbk_xsbtx()//zdbk 补选页面显示教师姓名
{
    console.log('[zju-webx]:zdbk_xsbtx');
    
    let colWidth='100px';//姓名列宽度

    function on_searchGrid(searchGrid) {
        //姓名表头
        let nameTh = document.getElementById('searchGrid_jsxm');
        if (!nameTh) { console.error('name th not found'); return; }
            nameTh.style.display = 'table-cell';
            nameTh.style.width = colWidth;
        
        let templateNameTd = document.querySelector('#searchGrid > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)');
        templateNameTd.style.display = 'table-cell';
        templateNameTd.style.width = colWidth;

        if (webxConfig.runAsBookmark) {
            let nameTds = searchGrid.querySelectorAll('td[aria-describedby="searchGrid_jsxm"]');
            nameTds.forEach(td => { td.style.display = 'table-cell'; });            
        }
        //add observer to searchGrid
        else watch(searchGrid, { subtree: true, childList: true },
            function (mutation) {
                if (//在诸多元素变化中过滤出所需的教材详细所在的td
                    mutation.type == 'childList'
                    && mutation.target.tagName == 'TBODY'
                    && mutation.addedNodes.length == 1
                    && mutation.addedNodes[0].tagName == 'TR'
                ) {
                    let nameTds = mutation.addedNodes[0].querySelectorAll('td[aria-describedby="searchGrid_jsxm"]');
                    nameTds.forEach(td => { td.style.display = 'table-cell'; });
                }
            }
        );
    }
    let searchGridGetter = () => document.getElementById('searchGrid'); //数据表格 
    if (webxConfig.runAsBookmark) {
        let searchGrid = searchGridGetter();
        if (searchGrid) on_searchGrid(searchGrid);
        else alert('[zju-webx]: 没有找到补选课程表格，可能不在补选时段？'); 
    }
    else {//油猴运行
        wait_element({ getter: searchGridGetter, callback: on_searchGrid, recursive: true });        
    }

}