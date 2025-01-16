export function autoScroll() {
    const distanceToBottom =
      $(document).height() - $(window).height() - $(window).scrollTop();
    // 如果#nextpage元素存在并且距离页面底部小于100px
    if ($("#nextPage").length > 0 && distanceToBottom < 100) {
      //更改nextPage元素的的innerText 为加载中
      $("#nextPage")[0].innerText = "加载中...";
  
      //如果#nextpage元素存在href属性 移除href属性
      if ($("#nextPage").attr("href")) {
        $("#nextPage").removeAttr("href");
      }
  
      // 模拟点击#nextpage元素
      $("#nextPage")[0].click();
  
      //再改为点此加载更多
      $("#nextPage")[0].innerText = "点此加载更多";
    }
  }
  
  