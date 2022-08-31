import { elements } from "./base";

// image_url: "http://forkify-api.herokuapp.com/images/pestoa0e7.jpg";
// publisher: "The Pioneer Woman";
// publisher_url: "http://thepioneerwoman.com";
// recipe_id: "47025";
// social_rank: 100;
// source_url: "http://thepioneerwoman.com/cooking/2011/06/pasta-with-pesto-cream-sauce/";
// title: "Pasta with Pesto Cream Sauce";

// private function
const renderRecipe = (recipe) => {
  console.log(recipe);
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};

export const clearSearchResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};

export const getInput = () => elements.searchInput.value;

export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10) => {
  // Хайлтанд үр дүнг хуудаслаж үзүүлэх
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Хуудаслалтын товчийг гаргаж ирнэ
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currentPage, totalPages);
};

const createButton = (page, type, direction) => `
  <button class="btn-inline results__btn--${type}" data-goto=${page}>
    <span>Хуудас ${page}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${direction}"></use>
    </svg>    
  </button>`;

const renderButtons = (currentPage, totalPages) => {
  let buttonHTML;

  if (currentPage === 1 && totalPages > 1) {
    // 1-р хуудас дээр байна. дараагийн хуудасны товчийг харуулна.
    buttonHTML = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    // Өмнөх болон дараагийн хуудасны товчийг харуулна.
    buttonHTML = createButton(currentPage - 1, "prev", "left");
    buttonHTML += createButton(currentPage + 1, "next", "right");
  } else if (currentPage === totalPages) {
    // Хамгийн сүүлийн хуудас дээр байна. Өмнөх хуудасны товчийг харуулна.
    buttonHTML = createButton(currentPage - 1, "prev", "left");
  }

  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHTML);
};
