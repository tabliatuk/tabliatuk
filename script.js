if (window.matchMedia('(display-mode: standalone)').matches) {
    // الموقع يُعرض كـ "تطبيق ويب"
}
 else {
    // الموقع يُعرض في المتصفح
    window.addEventListener('load', function() {
        if (!window.navigator.standalone) {
            // يمكن إضافة إشعار للمستخدم بتثبيت التطبيق
        }
    });
}


// جلب العناصر المضافة للسلة من localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الـ Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length; // تحديث عدد العناصر في السلة
}

// إضافة المنتجات إلى السلة
function addToCart(productName, productPrice, quantity) {
    const totalPrice = productPrice * quantity; // حساب السعر الإجمالي
    console.log(`إضافة المنتج: ${productName}, الكمية: ${quantity}, الإجمالي: ${totalPrice}`);

    // إضافة المنتج إلى السلة مع الكمية والسعر الإجمالي
    cartItems.push({ name: productName, price: productPrice, quantity: quantity, totalPrice: totalPrice });

    // حفظ السلة في localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log("سلة المنتجات الآن:", cartItems); // طباعة السلة بعد الإضافة
    // تحديث عداد السلة
    updateCartCount();
}

// عرض المنتجات في الصفحة الرئيسية مع دعم البحث
function displayProducts(products, searchQuery = '') {
    const productContainer = document.querySelector('.product-list');
    productContainer.innerHTML = ''; // مسح المنتجات السابقة

    // تصفية المنتجات بناءً على نص البحث
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>السعر: ${product.price} جنيه</p>
            <label for="quantity-${product.name}">الكمية:</label>
            <input type="number" id="quantity-${product.name}" value="1" min="1">
            <p>السعر الإجمالي: <span id="total-price-${product.name}">${product.price} جنيه</span></p>
            <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}">أضف إلى السلة</button>
        `;
        productContainer.appendChild(productDiv);

        // إضافة حدث لتغيير الكمية وحساب السعر الإجمالي
        const quantityInput = document.getElementById(`quantity-${product.name}`);
        const totalPriceElement = document.getElementById(`total-price-${product.name}`);

        quantityInput.addEventListener('input', function () {
            let quantity = quantityInput.value; // الحصول على القيمة كما هي
            if (quantity === '') return; // السماح بمسح الرقم مؤقتًا

            quantity = parseInt(quantity);
            if (isNaN(quantity) || quantity < 1) {
                quantityInput.value = 1; // إعادة تعيين القيمة إلى 1 عند الإدخال الخاطئ
            }
        });

        quantityInput.addEventListener('change', function () {
            let quantity = parseInt(quantityInput.value);
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
                quantityInput.value = 1;
            }

            const totalPrice = quantity * product.price;
            totalPriceElement.textContent = `${totalPrice} جنيه`;
        });
    });

    // إضافة الحدث لكل زر "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(document.getElementById(`quantity-${productName}`).value);

            // إضافة المنتج إلى السلة مع الكمية
            addToCart(productName, productPrice, quantity);
        });
    });
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    console.log("عرض السلة...");
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    cartTableBody.innerHTML = ''; // مسح العناصر السابقة
    let totalPrice = 0;

    // تحقق من وجود منتجات في السلة
    console.log("المنتجات في السلة:", cartItems);

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
        document.getElementById('whatsapp-checkout').style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';
        document.getElementById('whatsapp-checkout').style.display = 'block';

        // عرض المنتجات في السلة
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} جنيه</td>
                <td>${item.totalPrice} جنيه</td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.totalPrice;
        });

        // عرض الإجمالي
        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        // إنشاء رابط واتساب
        createWhatsAppLink(totalPrice);
    }
}

// إنشاء رابط الشراء عبر واتساب
function createWhatsAppLink(totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-btn');
    const productsText = cartItems.map(item => `${item.name} - ${item.price} ريال`).join('%0A');
    const message = `مرحباً، أرغب في شراء المنتجات التالية:%0A${productsText}%0Aالإجمالي: ${totalPrice} جنيه.`;
    const whatsappUrl = `https://wa.me/249119479189?text=${encodeURIComponent(message)}`;

    // عند الضغط على الزر يتم فتح رابط واتساب
    whatsappButton.onclick = function () {
        window.open(whatsappUrl, '_blank');
    };
}

// تفريغ السلة
function clearCart() {
    cartItems = [];
    localStorage.removeItem('cartItems');
    displayCart(); // إعادة عرض السلة بعد التفريغ
    updateCartCount();
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function () {
    // قائمة المنتجات
    const productList = [
        { name: "سجائر برنجي", price: 26500, img: "img/ei_1740559551465-removebg-preview.jpg", description: "باكو سجائر برنجي يحتوي على 20 علبة" },
        { name: "pall mall", price: 17500, img: "img/ei_1740559269656-removebg-preview.jpg", description: "باكو سجائر pall mall يحتوي على 20 علبه" },
        { name: "tradition", price: 24500, img: "img/ei_1740559395033-removebg-preview.jpg", description: "باكو سجائر traditon يحتوي على 20 علبة" },
        { name: "سجائر بن", price: 17500, img: "img/ei_1740559695067-removebg-preview.jpg", description: "سجائر بن يحتوي على 20 علبة" }
      
    ];

    // عرض المنتجات في الصفحة الرئيسية
    displayProducts(productList);

    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();

    // إذا كنا في صفحة السلة، نعرض محتويات السلة
    if (window.location.pathname.includes('cart.html')) {
        displayCart(); // عرض محتويات السلة
    }

    // إضافة مستمع الحدث للبحث
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const searchQuery = searchInput.value.trim();
        displayProducts(productList, searchQuery); // إعادة عرض المنتجات بناءً على نص البحث
    });

    // إضافة مستمع الحدث لتفريغ السلة
    const clearCartButton = document.getElementById('clear-cart-btn');
    clearCartButton.addEventListener('click', clearCart);
});
