import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  deleteItem(id) {
    // id-тай орцын индексийг массиваас хайж олно
    const index = this.items.findIndex((el) => el.id === id);

    // Дээрх индекстэй элементийг массиваас устгана
    this.items.splice(index, 1);
  }

  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };

    this.items.push(newItem);

    return newItem;
  }
}
