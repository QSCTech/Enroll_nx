export default async function bookDisplay() {
  const parser = new DOMParser();
  const targetRows = [];
  const su = extractSuFromCurrentUrl();
  const maxWaitTime = 10000; // 最大等待10秒
  let currentTime = 0;

  while (targetRows.length === 0 && currentTime < maxWaitTime) {
    const rows = Array.from(
      document.getElementsByClassName("ui-widget-content jqgrow ui-row-ltr")
    );
    rows.forEach((row) => {
      targetRows.push(row);
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    currentTime += 100;
  }

  // 使用 Promise.all 并发处理所有请求
  await Promise.all(
    targetRows.map(async (row, index) => {
      const data = "xkkh=" + row.id;
      const url =
        "http://zdbk.zju.edu.cn/jwglxt/xsxjc/xsxjc_cxJcxx.html?time=" +
        Date.now() +
        "&gnmkdm=N253535&su=" +
        su;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: data,
        });

        if (!response.ok) {
          throw new Error("解析失败");
        }

        const res = await response.text();
        const doc = parser.parseFromString(res, "text/html");
        let text = doc.body.textContent || doc.body.innerText;
        text = text.split(/[,:\t\n]/).filter((part) => part.trim() !== "");

        let bookInfo = "";
        if (text[1] === "无教材" || text[1] === "作者") {
          bookInfo = "教材名称：无教材";
        } else {
          text.forEach((word) => {
            if (
              word === "教材名称" ||
              word === "作者" ||
              word === "出版社" ||
              word === "版本"
            ) {
              bookInfo += word + "：";
            } else {
              bookInfo += word + "\n";
            }
          });
        }

        // 创建新的 tr 和 td 元素并插入到当前 row 后面
        const newTr = document.createElement("tr");
        const newTd = document.createElement("td");
        newTd.textContent = bookInfo;
        newTd.colSpan = "8";
        newTd.style.border = "black 2px solid";
        newTd.style.whiteSpace = "pre-wrap";
        newTr.appendChild(newTd);
        row.parentNode.insertBefore(newTr, row.nextSibling);
      } catch (error) {
        console.error("报错", error);
      }
    })
  );
}

function extractSuFromCurrentUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const suValue = urlParams.get("su");
  return suValue;
}
