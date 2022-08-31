import Search from "./model/search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/recipe";
import { renderRecipe, clearRecipe, highlightRecipe } from "./view/recipeView";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд
 * - Захиалж байгаа жорын найрлагууд
 */

const state = {};

/***********************************************************
 * Хайлтын контроллер = Модел --> Контроллер <-- Харагдац  *
 ***********************************************************/

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
    renderLoader(elements.searchResultDiv);

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд гаргана
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // автомат ажиллагааг нь зогсоодог функц.
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto);
    searchView.clearSearchResults();
    searchView.renderRecipes(state.search.result, gotoPage);
  }
});

/***********************************************************
 * Жорын контроллер = Модел --> Контроллер <-- Харагдац   *
 ***********************************************************/

const controlRecipe = async () => {
  // 1. URL-аас ID-ийг салгаж авна.
  const id = window.location.hash.replace("#", "");

  // 2. Жорын моделийг үүгэнэ.
  state.recipe = new Recipe(id);

  // 3. UI дэлгэцийг бэлтгэнэ.
  clearRecipe();
  renderLoader(elements.recipeDiv);
  highlightRecipe(id);

  // 4. Жорыг татаж авна.
  await state.recipe.getRecipe();

  // 5. Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
  clearLoader();
  state.recipe.calcTime();
  state.recipe.calcHumans();

  // 6. Жороо дэлгэцэнд гаргана.
  renderRecipe(state.recipe);
};
window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);
