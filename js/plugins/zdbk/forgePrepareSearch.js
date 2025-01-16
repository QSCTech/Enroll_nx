//查老师页面查询函数  照抄了一下查老师的查询函数 因为权限问题注入脚本没办法直接使用页面函数
export async function forgePrepareSearch() {
    const search_version = 5;
    const searchDataKey = "search-data";
    const searchVersionKey = "search-version";
    const searchLastUpdateKey = "search-last-update";
    const localVersion = Number(localStorage.getItem(searchVersionKey));
    const lastUpdateTime = Number(localStorage.getItem(searchLastUpdateKey));
    let searchData;
  
    if (
      localVersion &&
      localVersion === search_version &&
      Date.now() - lastUpdateTime < 7 * 24 * 60 * 60 * 1000
    ) {
      searchData = searchData || JSON.parse(localStorage.getItem(searchDataKey));
      if (searchData && "colleges" in searchData && "teachers" in searchData) {
        return;
      }
    }
  
    const now = new Date();
    const url =
      "/static/json/search.json?v=" +
      search_version +
      "&date=" +
      now.getUTCFullYear() +
      (now.getUTCMonth() + 1).toString().padStart(2, "0") +
      now.getUTCDate().toString().padStart(2, "0");
  
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if ("colleges" in data && "teachers" in data) {
          searchData = data;
          localStorage.setItem(searchDataKey, JSON.stringify(data));
          localStorage.setItem(searchVersionKey, search_version.toString());
          localStorage.setItem(searchLastUpdateKey, Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  }
  