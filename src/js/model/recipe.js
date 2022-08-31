import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const result = await axios(
      "https://forkify-api.herokuapp.com/api/get?rId=" + this.id
    );

    this.image_url = result.data.recipe.image_url;
    this.ingredients = result.data.recipe.ingredients;
    this.publisher = result.data.recipe.publisher;
    this.publisher_url = result.data.recipe.publisher_url;
    this.recipe_id = result.data.recipe.recipe_id;
    this.social_rank = result.data.recipe.social_rank;
    this.source_url = result.data.recipe.source_url;
    this.title = result.data.recipe.title;
  }

  calcTime() {
    // Найрлага бүрт ойролцоогоор 5 минут зарцуулна
    this.time = this.ingredients.length * 5;
  }

  calcHumans() {
    this.humanCount = 4;
  }
}
