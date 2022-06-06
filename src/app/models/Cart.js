function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id) {
    let storedItem = this.items[id];

    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }

    storedItem.quantity++;
    storedItem.price = storedItem.item.price * storedItem.quantity;
    this.totalQuantity++;
    this.totalPrice += storedItem.item.price;
  };

  this.destroy = function (id) {
    this.totalQuantity -= this.items[id].quantity;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.generateArray = function () {
    let array = [];

    for (var id in this.items) {
      array.push(this.items[id]);
    }

    return array;
  };
}

module.exports = Cart;
