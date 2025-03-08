export default async function bookDisplay() {
  const parser = new DOMParser();
  const targetRows = [];
  const su = extractSuFromCurrentUrl();
  const maxWaitTime = 10000; // 最大等待10秒
  let currentTime = 0;
  let thElement1,thElement2,thElement3,thElement4;
  let table;

  // 创建新的 tr 和 td 元素并插入到当前 row 后面


  
  const checkInterval1 = setInterval(() => {
    if (thElement1&&table) {
      clearInterval(checkInterval1);

      const columnIndex = Array.from(thElement1.parentElement.children).indexOf(thElement1);

      // 删除<thead>中的<th>
      thElement1.remove();

      // 删除<tbody>中对应的<td>
      const tbody = table.querySelector("tbody");
      
      if (tbody) {
        tbody.querySelectorAll("tr").forEach(row => {
          const tdToRemove = row.querySelectorAll("td")[columnIndex];
          console.log(tdToRemove);
          if (tdToRemove) {
            tdToRemove.remove();
          }
        });
      }
    }
    else {
      thElement1 = document.getElementById('tabGrid_jcydsj');
      table = document.getElementById("tabGrid");
    }
  }, 100);

  const checkInterval2 = setInterval(() => {
    if (thElement2&&table) {
      clearInterval(checkInterval2);

      const columnIndex = Array.from(thElement2.parentElement.children).indexOf(thElement2);

      // 删除<thead>中的<th>
      thElement2.remove();

      // 删除<tbody>中对应的<td>
      const tbody = table.querySelector("tbody");
      
      if (tbody) {
        tbody.querySelectorAll("tr").forEach(row => {
          const tdToRemove = row.querySelectorAll("td")[columnIndex];
          console.log(tdToRemove);
          if (tdToRemove) {
            tdToRemove.remove();
          }
        });
      }
    }
    else {
      thElement2 = document.getElementById('tabGrid_skdd');
      table = document.getElementById("tabGrid");
    }
  }, 100);

  const checkInterval3 = setInterval(() => {
    if (thElement3&&table) {
      clearInterval(checkInterval3);

      const columnIndex = Array.from(thElement3.parentElement.children).indexOf(thElement3);

      // 删除<thead>中的<th>
      thElement3.remove();

      // 删除<tbody>中对应的<td>
      const tbody = table.querySelector("tbody");
      
      if (tbody) {
        tbody.querySelectorAll("tr").forEach(row => {
          const tdToRemove = row.querySelectorAll("td")[columnIndex];
          console.log(tdToRemove);
          if (tdToRemove) {
            tdToRemove.remove();
          }
        });
      }
    }
    else {
      thElement3 = document.getElementById('tabGrid_sksj');
      table = document.getElementById("tabGrid");
    }
  }, 100);


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


        // const newTr = document.createElement("tr");
        // const newTd = document.createElement("td");
        // newTd.textContent = bookInfo;
        // newTd.colSpan = "8";
        // newTd.style.border = "black 2px solid";
        // newTd.style.whiteSpace = "pre-wrap";
        // newTr.appendChild(newTd);
        // row.parentNode.insertBefore(newTr, row.nextSibling);
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
