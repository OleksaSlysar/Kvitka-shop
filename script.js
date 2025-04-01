document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCart();
    checkAdminLogin();
    setupBurgerMenu();
    
    document.getElementById("login-form")?.addEventListener("submit", loginAdmin);
    document.getElementById("logout-btn")?.addEventListener("click", logoutAdmin);
});

// 🔹 Завантаження товарів
function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => console.error("Помилка завантаження товарів:", error));
}

// 🔹 Відображення товарів
function displayProducts(products) {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";
    products.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("product");
        item.innerHTML = `
            <img src="image/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} грн</p>
            <button onclick="addToCart(${product.id})">Додати в кошик</button>
        `;
        container.appendChild(item);
    });
}

// 🔹 Завантаження кошика
function loadCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let totalPrice = 0;

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let cart = JSON.parse(getCookie("cart")) || [];

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <img src="image/${product.image}" alt="${product.name}">
                        <span>${product.name} (${item.quantity} шт.)</span>
                        <span>${product.price * item.quantity} грн</span>
                        <button onclick="removeFromCart(${product.id})">❌</button>
                    `;
                    cartContainer.appendChild(cartItem);
                    totalPrice += product.price * item.quantity;
                }
            });

            totalPriceElement.textContent = `Загальна сума: ${totalPrice} грн`;
        })
        .catch(error => console.error("Помилка завантаження кошика:", error));
}

// 🔹 Додавання товару в кошик
function addToCart(productId) {
    let cart = JSON.parse(getCookie("cart")) || [];

    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    setCookie("cart", JSON.stringify(cart));
    loadCart();
}

// 🔹 Видалення товару з кошика
function removeFromCart(productId) {
    let cart = JSON.parse(getCookie("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    setCookie("cart", JSON.stringify(cart));
    loadCart();
}

// 🔹 Очищення кошика
document.getElementById("clear-cart")?.addEventListener("click", () => {
    setCookie("cart", "[]");
    loadCart();
});

// 🔹 Оформлення замовлення
function showReceipt() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let cart = JSON.parse(getCookie("cart")) || [];

            if (cart.length === 0) {
                alert("Ваш кошик порожній!");
                return;
            }

            let receiptText = "🛒 Ваше замовлення:\n";
            let total = 0;

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    receiptText += `✅ ${product.name} (${item.quantity} шт.) — ${product.price * item.quantity} грн\n`;
                    total += product.price * item.quantity;
                }
            });

            receiptText += `\n💰 Загальна сума: ${total} грн\n\n🎉 Дякуємо за покупку!`;

            alert(receiptText);
            setCookie("cart", "[]");
            loadCart();
        })
        .catch(error => console.error("Помилка оформлення замовлення:", error));
}

document.getElementById("checkout")?.addEventListener("click", showReceipt);

// 🔹 Керування куками
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : "[]";
}

function setCookie(name, value, days = 7) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function checkAdminLogin() {
    const isAdmin = localStorage.getItem("isAdmin") === "true"; // Перевірка логіну
    const loginSection = document.getElementById("login-section");
    const adminPanel = document.getElementById("admin-panel");

    // Якщо адмін увійшов
    if (isAdmin) {
        loginSection?.classList.add("hidden");  // Приховуємо форму логіну
        adminPanel?.classList.remove("hidden"); // Показуємо панель адміністратора
    } else {
        loginSection?.classList.remove("hidden"); // Показуємо форму логіну
        adminPanel?.classList.add("hidden");      // Приховуємо панель адміністратора
    }
}

function loginAdmin(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки
    const username = document.getElementById("admin-username").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    // Перевірка правильності логіну та паролю
    if (username === "Denis" && password === "1488") {
        localStorage.setItem("isAdmin", "true"); // Зберігаємо авторизацію в localStorage
        checkAdminLogin(); // Оновлюємо панель після логіну
    } else {
        alert("❌ Неправильний логін або пароль!"); // Повідомлення про помилку
    }
}

function logoutAdmin() {
    localStorage.removeItem("isAdmin"); // Видаляємо авторизацію
    checkAdminLogin(); // Оновлюємо панель після лог-ауту
}
// 🔹 Функція бургер-меню
function setupBurgerMenu() {
    const burgerBtn = document.getElementById("burger-menu-btn");
    const burgerMenu = document.getElementById("burger-menu");

    burgerBtn?.addEventListener("click", () => {
        burgerMenu?.classList.toggle("open");
    });
}
