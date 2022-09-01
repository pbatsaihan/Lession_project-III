export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, publisher, image_url) {
    const like = { id, title, publisher, image_url };
    this.likes.push(like);
    return like;
  }

  removeLike(id) {
    // id-тай орцын индексийг массиваас хайж олно
    const index = this.likes.findIndex((el) => el.id === id);

    // Дээрх индекстэй элементийг массиваас устгана
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getCountOfLikes() {
    return this.likes.length;
  }
}
