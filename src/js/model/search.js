import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async doSearch() {
    try {
      let result = await axios(
        "https://forkify-api.herokuapp.com/api/search?q=" + this.query
      );
      this.results = result.data.recipes;
      return this.results;
    } catch (error) {
      alert("Алдаа гарлаа: " + error);
    }
  }
}

/*************************************************************/
// import axios from "axios";

// export default class Search {
//   constructor(query) {
//     this.query = query;
//   }
//   async doSearch() {
//     try {
//       let result = await axios(
//         "https://www.omdbapi.com/?s=" + this.query + "&apikey=1ee19e8c"
//       );
//       this.results = result.data.Search;
//       return this.results;
//     } catch (error) {
//       alert("Алдаа гарлаа: " + error);
//     }
//   }
// }
