export default async function bookDisplay() {
  const parser = new DOMParser();
  const targetRows = [];
  const su = extractSuFromCurrentUrl();
  const maxWaitTime = 10000; // 最大等待10秒
  let currentTime = 0;
  let table;



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

  const BigTable = document.getElementsByClassName('ui-jqgrid ui-widget ui-widget-content ui-corner-all')[0];
  let tip = document.createElement('div');
  tip.textContent ='温馨提示：放大或缩小此窗口会导致显示不正常，刷新即可';
  tip.style.color = '#0483D4';
  tip.style.fontSize = '20px';
  BigTable.parentNode.insertBefore(tip, BigTable);

  // 使用 Promise.all 并发处理所有请求
  await Promise.all(
    targetRows.map(async (row, index) => {
      const data = "xkkh=" + row.id;
      const url =
        "https://zdbk.zju.edu.cn/jwglxt/xsxjc/xsxjc_cxJcxx.html?time=" +
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
        console.log(text);
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

        const newTd = row.querySelectorAll("td")[8];
        newTd.textContent = bookInfo;
        newTd.style.border = "black 2px solid";
        newTd.style.whiteSpace = "pre-wrap";
      } catch (error) {
        console.error("报错", error);
      }
    })
  );



  removeColumns('tabGrid_xxq', table);
  removeColumns('tabGrid_skdd', table);
  removeColumns('tabGrid_sksj', table);
}

function extractSuFromCurrentUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const suValue = urlParams.get("su");
  return suValue;
}


function removeColumns(thID, table) {

  let thElement;
  thElement = document.getElementById(thID);
  table = document.getElementById("tabGrid");
  if (thElement && table) {
    const tbody = table.querySelector("tbody");

    const columnIndex = Array.from(thElement.parentElement.children).indexOf(thElement);

    // 删除<thead>中的<th>
    thElement.remove();

    // 删除<tbody>中对应的<td>

    if (tbody) {
      tbody.querySelectorAll("tr").forEach(row => {
        const tdToRemove = row.querySelectorAll("td")[columnIndex];
        //console.log(tdToRemove);
        if (tdToRemove) {
          tdToRemove.remove();
        }
      });
    }
  }

}