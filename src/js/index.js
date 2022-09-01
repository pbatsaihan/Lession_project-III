import Search from "./model/search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/recipe";
import { renderRecipe, clearRecipe, highlightRecipe } from "./view/recipeView";
import Like from "./model/like";
import List from "./model/list";
import * as listView from "./view/listView";
import * as likeView from "./view/likeView";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд
 * - Захиалж байгаа жорын найрлагууд
 */

const state = {};
// Like цэсийг хаах
likeView.toggleLikeMenu(0);

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
  if (!state.likes) state.likes = new Like();

  // URL дээр ID байгаа эсэхийг шалгаад ажиллах
  if (id) {
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
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

/***********************************************************
 * Орцын контроллер = Модел --> Контроллер <-- Харагдац  *
 ***********************************************************/
const controlList = () => {
  // Найрлагын модел үүсгэнэ
  state.list = new List();
  // Өмнө харагдаж байсан орцын жагсаалтыг арилгана
  listView.clearItem();

  // Модел руу харагдаж байгаа орцуудыг нэмнэ
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    listView.renderItem(item);
  });
};

/***********************************************************
 * Like контроллер = Модел --> Контроллер <-- Харагдац  *
 ***********************************************************/
const controlLike = () => {
  // 1 Like-ийн моделийг үүсгэнэ
  if (!state.likes) state.likes = new Like();

  // 2 Одоо харагдаж байгаа жорын ID-ийг олж авах
  const currentRecipeId = state.recipe.id;

  // 3 Энэ жорыг liked эсэхийг шалгана
  if (state.likes.isLiked(currentRecipeId)) {
    // Лайк моделиос энэ орцыг хасна
    state.likes.removeLike(currentRecipeId);

    // Лайк цэснээс энэ орцыг устгана
    likeView.deleteLike(currentRecipeId);

    // Лайк товчийг өөрчилна
    likeView.toggleLikeBtn(false);
  } else {
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likeView.renderLike(newLike);
    likeView.toggleLikeBtn(true);
  }
  // 4

  likeView.toggleLikeMenu(state.likes.getCountOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  // Клик хийсэн li элементийн data-itemid атрибутыг шүүж авах
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Авсан id-тай орцыг моделиос устгана
  state.list.deleteItem(id);

  // Дээрх id-тэй орцыг дэлгэцээс арилгана
  listView.deleteItem(id);
});
