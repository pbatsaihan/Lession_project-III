import Search from "./model/search";

let search = new Search("pizza");

search.doSearch().then((r) => console.log(r));
