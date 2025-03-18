
const flowers = [
    { id: 1, name: "Троянда ", color: "Червона", price: 100, type: "Троянда" },
    { id: 2, name: "Тюльпан", color: "Жовтий", price: 80, type: "Тюльпан" },
    { id: 3, name: "Лілія", color: "Біла", price: 120, type: "Лілія" },
    { id: 4, name: "Троянда", color: "Біла", price: 110, type: "Троянда" },
];

let cart = [];

function displayProducts(products) {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';  

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <img src="flower.jpg" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.color}</p>
            <p>Ціна: ${product.price} UAH</p>
            <button onclick="addToCart(${product.id})">В кошик</button>
        `;
        productList.appendChild(productElement);
    });
}


function filterProducts() {
    const selectedType = document.getElementById('flowerType').value;
    const filteredFlowers = selectedType
        ? flowers.filter(flower => flower.type === selectedType)
        : flowers;
    displayProducts(filteredFlowers);
}


function addToCart(id) {
    const product = flowers.find(flower => flower.id === id);
    if (product) {
        cart.push(product);
        updateCart();
    }
}


function updateCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';  

    let totalPrice = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.name} (${item.color}) - ${item.price} UAH`;
        cartList.appendChild(itemElement);
        totalPrice += item.price;
    });

    document.getElementById('totalPrice').textContent = `Загальна вартість: ${totalPrice} UAH`;
}

displayProducts(flowers);
