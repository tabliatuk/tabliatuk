// جلب المنتجات من localStorage أو إنشاء مصفوفة فارغة
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الهيدر
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
}

// عرض المنتجات في صفحة السلة
function displayCart() {
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    const whatsappButton = document.getElementById('whatsapp-checkout');
    const clearCartContainer = document.getElementById('clear-cart-container');
    const clearCartButton = document.getElementById('clear-cart-btn');

    cartTableBody.innerHTML = ''; // مسح العناصر السابقة
    let totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
        whatsappButton.style.display = 'none';
        clearCartContainer.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';
        whatsappButton.style.display = 'block';
        clearCartContainer.style.display = 'block';

        cartItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} جنيه</td>
                <td>${item.totalPrice} جنيه</td>
                <td><button class="remove-btn" data-index="${index}">حذف</button></td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.totalPrice;
        });

        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        createWhatsAppLink(totalPrice);
    }

    // إضافة حدث لحذف المنتج من السلة
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(button.getAttribute('data-index'));
            removeFromCart(index);
        });
    });

    // إضافة حدث لتفريغ السلة
    if (clearCartButton) {
        clearCartButton.onclick = emptyCart;
    }
}

// إضافة منتج إلى السلة
function addToCart(product) {
    const existingItem = cartItems.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += product.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
        cartItems.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}

// حذف منتج من السلة
function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
}

// تفريغ السلة بالكامل
function emptyCart() {
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
}

// إنشاء رابط واتساب لطلب المنتجات
function createWhatsAppLink(totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-checkout');

    const productsText = cartItems.map((item, index) => 
        `${index + 1}- *${item.name}* %0A   🔹 الكمية: ${item.quantity} %0A   🔹 السعر: ${item.price} جنيه %0A   🔹 الإجمالي: ${item.totalPrice} جنيه`
    ).join('%0A%0A');

    const message = `📦 *طلب جديد* 📦%0A%0A` + 
                    `🛒 *تفاصيل المنتجات:* %0A%0A${productsText}%0A%0A` + 
                    `💰 *الإجمالي الكلي:* ${totalPrice} جنيه %0A%0A` + 
                    `📍 *يرجى إرسال عنوان التوصيل وطريقة الدفع المطلوبة*`;

    const whatsappUrl = `https://wa.me/249119479189?text=${message}`;

    if (whatsappButton) {
        whatsappButton.onclick = function() {
            window.open(whatsappUrl, '_blank');
        };
    }
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});