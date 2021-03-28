var faker = require('faker');

var database = { products: []};

for (var i = 1; i<= 3; i++) {
  database.products.push({
    productId: i,
    productName: faker.commerce.productName(),
    productDesc: faker.lorem.sentences(2),
    productPrice: faker.commerce.price(),
  });
}

console.log(JSON.stringify(database));