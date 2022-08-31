import Search from "./model/search";
import { elements } from "./view/base";
import * as searchView from "./view/searchView";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд
 * - Захиалж байгаа жорын найрлагууд
 */

const state = {};

const controlSearch = async () => {
  console.log("Дарагдлаа ....");
  // 1) Вэбээс хайлтын түлхүүр үгийг авна
  const query = searchView.getInput();

  if (query) {
    // 2) Шинээр хайлтын обектийг үүсгэж өгнө
    state.search = new Search(query);

    // 3) Хайлт хийхэд зориулж дэлгэцийг бэлтгэнэ
    searchView.clearSearchQuery();
    searchView.clearSearchResults();

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд гаргана
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // автомат ажиллагааг нь зогсоодог функц.
  controlSearch();
});
