//在上方表格中点击获取相应时间
//通过比较时间获取课程代码
//xskcdm:学生课程代码
//需要优化：
// 同一课程点击两次出现类似没有渲染，再点击恢复正常（好怪？）
export async function lessonTableMatch() {
    // 新建展示模块
    const copyy = document.createElement("div");
    const firstNode = document.getElementsByClassName('outer_xkxx_list')[0];
    if (firstNode) {
        const fatherr = firstNode.parentNode;
        if (fatherr) {
            fatherr.insertBefore(copyy, firstNode);
        }
    }
    copyy.setAttribute('class', 'outer_xkxx_list');
    copyy.style.backgroundColor = 'lightyellow';

    // 匹配时间得到课程代码
    function renew(timeNumber, semester, prefix) {
        const xskcChooseArray = [];
        let xskcChooseElement;
        const xskcdm1 = document.getElementsByClassName('list-group-item');
        for (let i = 0; i < xskcdm1.length; i++) {
            let timeString = xskcdm1[i].getAttribute('data-sksj');
            const regex = new RegExp(`^(.*)(${dayMap[prefix]})([^节]*)(第|,)(${timeNumber})(节|,)(.*)$`);
            const match = timeString.match(regex);
            //console.log(match);
            let semesterCompare = xskcdm1[i].getAttribute('data-xxq');
            if (match) {
                if (semesterCompare.length === 2 || semester === semesterCompare) {
                    xskcChooseElement = xskcdm1[i].getAttribute('data-xkkh').split('-')[3];
                    if (xskcChooseArray.length === 0 || xskcChooseElement !== xskcChooseArray.at(-1)) {
                        xskcChooseArray.push(xskcChooseElement);
                    }

                }
            }
        }


        //匹配复制到新模块
        const xskcdm2 = document.getElementsByClassName('outer_xkxx_list');
        let oldNode;
        if (xskcChooseArray.length) {
            for (let j = 0; j < xskcChooseArray.length; j++) {
                let xskcChoose = xskcChooseArray[j];
                for (let i = 1; i < xskcdm2.length; i++) {
                    let nameCompare2 = xskcdm2[i].getAttribute('data-xskcdm');
                    if (nameCompare2) {
                        if (nameCompare2.includes(xskcChoose)) {
                            let getNode = document.querySelector('.outer_xkxx_list[data-xskcdm="' + nameCompare2 + '"]');
                            if (getNode) {
                                let newContent = getNode.cloneNode(true);
                                copyy.appendChild(newContent);

                            }
                            break;

                        }
                    }
                }
            }
        }
    }
    // 以下为对于课表的信息获取
    const dayMap = {
        '1_': '周一',
        '2_': '周二',
        '3_': '周三',
        '4_': '周四',
        '5_': '周五',
        '6_': '周六',
        '7_': '周日'
    };

    // 合并所有点击事件处理
    document.body.addEventListener("click", function (event) {

        if (event.target.closest(".outer_left") || (event.target.matches('[data-xxq]') && event.target.matches('[role="tab"]'))) {
            const regex = /^\d+_\d+$/; // 定义正则表达式

            let matchingElements = [];


            const checkInterval = setInterval(() => {
                if (matchingElements.length > 0) {
                    clearInterval(checkInterval); // 停止等待
                    for (let element of matchingElements) {
                        // 获取元素的纯文本内容
                        //const text = element.textContent;
                        const text = element.innerHTML;

                        // 创建一个新的 <a> 标签
                        const link = document.createElement('a');
                        link.innerHTML = text; // 设置链接的文本内容
                        link.href = "javascript:void(0);"; // 设置链接的目标地址
                        link.className = 'link';

                        // 清空原元素内容并添加链接
                        element.innerHTML = ""; // 清空原元素内容
                        element.appendChild(link); // 将链接添加到原元素中
                    }
                } else {
                    console.log("Still waiting...");
                    // 过滤出符合正则表达式的元素
                    const allElementsWithId = document.querySelectorAll("[id]");
                    matchingElements = Array.from(allElementsWithId).filter(element => {
                        return regex.test(element.id);
                    });
                }
            }, 100);


        }



        for (let prefix in dayMap) {
            let slot;
            if (event.target.matches(`[id^='${prefix}']`)) {
                copyy.innerHTML = "";
                slot = event.target.id;
            }
            else if (event.target.parentNode.parentNode.matches(`[id^='${prefix}']`)) {
                copyy.innerHTML = "";
                slot = event.target.parentNode.parentNode.id;
            }
            else{
                continue;
            }
            let timeNumber = slot.split('_')[1];
            const semester = matchSemester();
            console.log(semester);
            renew(timeNumber, semester, prefix);
        }

    }, true);

    function matchSemester() {
        let getSemester;
        let tab = document.querySelector('[data-xxq][aria-expanded="true"]');
        if (tab) {
            getSemester = tab.getAttribute('data-xxq');
        }
        else {
            const tabs = document.querySelectorAll('[data-toggle="tab"]');
            tab = Array.from(tabs).find(element => element.innerHTML.includes('课表'));
            getSemester = tab.getAttribute('data-xxq');
        }
        return getSemester
    }
}


