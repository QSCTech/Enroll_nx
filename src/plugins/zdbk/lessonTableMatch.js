//在上方表格中点击获取相应时间
//通过比较时间获取课程代码
//实在没有想到更便捷的办法，只能穷举了
//我觉得肯定有简便写法，可是我真的没想到（QAQ）
//需要优化：
// 同一课程点击两次出现类似没有渲染，再点击恢复正常（好怪？）
export async function lessonTableMatch() {
    let getTime;//得到课程时间
    //新建展示模块
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
    //放了个不一样的背景颜色易于区分，目前是淡黄色，可以请产品的同学看看什么颜色最合适
    //匹配时间得到课程代码
    function renew() {
        let xskcChoose;
        const xskcdm1 = document.getElementsByClassName('list-group-item');
        for (let i = 0; i < xskcdm1.length; i++) {
            let nameCompare1 = xskcdm1[i].getAttribute('data-sksj');
            if (getTime) {
                if (nameCompare1.includes(getTime)) {
                    xskcChoose = xskcdm1[i].getAttribute('data-xkkh').split('-')[3];
                    break;
                }
            }
        }
        //匹配复制到新模块
        const xskcdm2 = document.getElementsByClassName('outer_xkxx_list');
        for (let i = 0; i < xskcdm2.length; i++) {
            let nameCompare2 = xskcdm2[i].getAttribute('data-xskcdm');
            if (xskcChoose && nameCompare2) {
                if (nameCompare2.includes(xskcChoose)) {
                    let getNode = document.querySelector(`[data-xskcdm="${nameCompare2}"]`);
                    if (getNode) {
                        let newContent = getNode.cloneNode(true); 
                        copyy.innerHTML = ""; 
                        copyy.appendChild(newContent);
                    }
                    break;
                }
            }
        }
    }
    //以下为对于课表的信息获取

    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='1_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周一第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='2_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周二第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='3_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周三第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='4_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周四第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='5_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周五第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='6_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周六第${timeNumber}`;
            renew();
        }
    });
    document.body.addEventListener("click", function (event) {
        if (event.target.matches("[id^='7_']")) {
            let slot = event.target.id;
            let timeNumber = slot.split('_')[1];
            if (timeNumber === '7') {
                if (document.getElementById(`${slot[0]}_6`).innerHTML) {
                    timeNumber = '6';
                }
            }
            getTime = `周日第${timeNumber}`;
            renew();
        }
    });
}
