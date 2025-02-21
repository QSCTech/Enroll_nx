let totalTHs = [1, 3, 4, 8];//所有需要排列的列编号
let state;//是否增加标识
import { sortFunction } from "./sortFunction.js";
export async function sortTable(element) {
    await new Promise((r) => setTimeout(r, 1000));//等待加载完成
    let selectTable = $(element).siblings().first().find("table");
    let tableTHs = $(selectTable).find("thead").children("tr").children("th");//获取目标行
    let tablecode = $(selectTable).find("tbody").attr("id");//所在表格的id
    state = 0;
    stateFlash(tableTHs, -1);//初始状态
    state = 1;
    //教师评分
    clickFunction(tableTHs, 1, tablecode, 2, "float");
    //上课时间
    clickFunction(tableTHs, 3, tablecode, 5, "string");
    //上课地点
    clickFunction(tableTHs, 4, tablecode, 6, "string");
    //国际化课程
    clickFunction(tableTHs, 8, tablecode, 10, "string");
}
//将点击事件模块化
function clickFunction(ths, number, tablecode, iCol, sDataType) {
    let tagTH = ths[number];
    if (!tagTH) {
        console.error(`Invalid TH1 element at index ${number}`);
        return;
    }
    tagTH.onclick = function () {
        sortFunction(tablecode, iCol, sDataType);
        stateFlash(ths, number);
    };
}
//有“▲”的表示能够按照这一列的数据排列但是没有排列，有“▼”的表示正在按照这一列的数据排列
function stateFlash(ths, number) {
    for (let i = 0; i < totalTHs.length; i++) {
        let th = ths[totalTHs[i]];
        if (!th) {
            console.error(`Invalid TH2 element at index ${totalTHs[i]}`);
            continue;
        }
        if (state == 0) {
            th.innerText = th.innerText + "▲"; // 初始状态
        } else {
            if (th.innerText.match("▼")) {
                th.innerText = th.innerText.replace("▼", "▲"); // 所有回归初始状态
            }
        }
    }
    if (state == 1) {
        let th = ths[number];
        if (th) {
            th.innerText = th.innerText.replace("▲", "▼"); // 所在列改变
        } else {
            console.error(`Invalid TH3 element at index ${number}`);
        }
    }
}