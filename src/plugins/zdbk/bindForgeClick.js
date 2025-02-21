import { loadScoreData } from "./loadScoreData.js";
import { sortTable } from "./sortTable.js";
//为页面上所有选课pannel绑定点击事件 使得点击后修改dom
export function bindForgeClick() {
  //查找所有class为kched的元素 为他们新绑定点击事件 loadScoreData 函数 和 sortTable 函数

  $(".panel-heading").each(function (index, element) {
    // $(element).click(loadScoreData);
    //如果没有绑定过
    if (
      !$(element).data("events") ||
      !$(element).data("events").bindForgeClick
    ) {
      //绑定点击事件
      $(element).click((event) => loadScoreData(event.currentTarget));
      $(element).click((event) => sortTable(event.currentTarget));
      //绑定完给加上data标签防止重复绑定
      $(element).data("events", { bindForgeClick: true });

      //如果这个panel是默认展开的 直接对他调用一次loadScoreData
      //兄弟元素 的style属性的display属性为block
      if ($(element).siblings().first().attr("style") == "display: block;") {
        loadScoreData(element);
        sortTable(element);
      }
    }
  });
}
