
// Navbar scroll effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').split('#')[1];
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('%c🐟 The Bluefin India Website', 'color: #1565C0; font-size: 20px; font-weight: bold;');

// E-commerce Shop Functionality
const products = [
    { id: 1, name: 'Yellowfin Tuna Steaks', price: 1200, image: 'images/tuna-steaks.jpg', desc: 'Premium cut, sushi-grade Yellowfin tuna steaks. Perfect for grilling, searing, or enjoying raw as sashimi.' },
    { id: 2, name: 'Yellowfin Saku Blocks', price: 1500, image: 'images/tuna-on-wood.jpg', desc: 'Perfect for sashimi. Premium quality saku blocks ready to slice and serve.' },
    { id: 3, name: 'Whole Yellowfin Loin', price: 1000, image: 'images/tuna-on-ice.jpg', desc: 'Bulk order, restaurant quality. Whole loin perfect for restaurants and catering.' },
    { id: 4, name: 'Tuna Cubes', price: 900, image: 'images/tuna-artistic.jpg', desc: 'Pre-cut for convenience. Ready to cook tuna cubes for quick meals.' },
    { id: 5, name: 'Tuna Belly (Toro)', price: 2000, image: 'images/bluefin-underwater.jpg', desc: 'Fatty, premium cut. The most prized part of the tuna, rich and buttery.' },
    { id: 6, name: 'Smoked Yellowfin', price: 1800, image: 'images/tuna-can.jpg', desc: 'Ready to eat. Perfectly smoked tuna, ready to enjoy.' },
    { id: 7, name: 'Tuna Tataki', price: 1600, image: 'images/tuna-jumping.jpg', desc: 'Seared, ready to serve. Lightly seared tuna with perfect texture.' },
    { id: 8, name: 'Yellowfin Poke Mix', price: 1400, image: 'images/tuna-school-underwater.jpg', desc: 'Marinated, ready to serve. Fresh poke bowl mix with authentic flavors.' }
];

let cart = [];
let currentProduct = null;

// Initialize
function initShop() {
    updateCartCount();

    const modalQuantity = document.getElementById('modalQuantity');
    const modalGiftWrap = document.getElementById('modalGiftWrap');

    if (modalQuantity) {
        modalQuantity.addEventListener('input', updateModalTotal);
    }

    if (modalGiftWrap) {
        modalGiftWrap.addEventListener('change', updateModalTotal);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initShop();

    // Splash Screen Hiding Logic
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }, 2000); // Show splash for 2 seconds
    }
});

// Quick Add to Cart
function quickAdd(id, name, price) {
    const product = {
        id: id,
        name: name,
        price: price,
        quantity: 1,
        giftWrap: false
    };

    const existingIndex = cart.findIndex(item => item.id === id && !item.giftWrap);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    updateCartCount();
    showNotification('Added to cart!');
}

// Open Product Detail Modal
function openProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProduct = product;

    const elements = {
        img: document.getElementById('modalProductImage'),
        name: document.getElementById('modalProductName'),
        price: document.getElementById('modalProductPrice'),
        desc: document.getElementById('modalProductDesc'),
        qty: document.getElementById('modalQuantity'),
        wrap: document.getElementById('modalGiftWrap')
    };

    if (elements.img) elements.img.src = product.image;
    if (elements.name) elements.name.textContent = product.name;
    if (elements.price) elements.price.textContent = '₹' + product.price.toLocaleString('en-IN');
    if (elements.desc) elements.desc.textContent = product.desc;
    if (elements.qty) elements.qty.value = 1;
    if (elements.wrap) elements.wrap.checked = false;

    updateModalTotal();

    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeProductDetail() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function increaseModalQuantity() {
    const input = document.getElementById('modalQuantity');
    if (input) {
        input.value = parseInt(input.value) + 1;
        updateModalTotal();
    }
}

function decreaseModalQuantity() {
    const input = document.getElementById('modalQuantity');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateModalTotal();
    }
}

function updateModalTotal() {
    if (!currentProduct) return;

    const qtyInput = document.getElementById('modalQuantity');
    const wrapInput = document.getElementById('modalGiftWrap');
    const totalDisplay = document.getElementById('modalTotal');

    if (!qtyInput || !totalDisplay) return;

    const quantity = parseInt(qtyInput.value);
    const giftWrap = wrapInput ? wrapInput.checked : false;

    let total = currentProduct.price * quantity;
    if (giftWrap) total += 50;

    totalDisplay.textContent = '₹' + total.toLocaleString('en-IN');
}

function addToCartFromModal() {
    if (!currentProduct) return;

    const qtyInput = document.getElementById('modalQuantity');
    const wrapInput = document.getElementById('modalGiftWrap');

    if (!qtyInput) return;

    const product = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: parseInt(qtyInput.value),
        giftWrap: wrapInput ? wrapInput.checked : false,
        image: currentProduct.image
    };

    const existingIndex = cart.findIndex(item =>
        item.id === product.id && item.giftWrap === product.giftWrap
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    updateCartCount();
    closeProductDetail();
    showNotification('Added to cart!');
}

// Cart Functions
function openCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    renderCart();
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item-modal">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details-modal">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString('en-IN')}/kg</p>
                ${item.giftWrap ? '<span class="gift-tag"><i class="fas fa-gift"></i> Gift Wrapped</span>' : ''}
                <div class="quantity-controls-inline">
                    <button onclick="updateCartQuantity(${index}, -1)"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity} kg</span>
                    <button onclick="updateCartQuantity(${index}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="cart-item-actions-modal">
                <div class="item-total">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                <button class="btn-remove-modal" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartQuantity(index, change) {
    if (!cart[index]) return;
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();

    if (cart.length === 0) {
        closeCart();
    }
}

function updateCartSummary() {
    let subtotal = 0;
    let giftWrapCost = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        if (item.giftWrap) giftWrapCost += 50;
    });

    const total = subtotal + giftWrapCost;

    const subEle = document.getElementById('cartSubtotal');
    const wrapEle = document.getElementById('cartGiftWrap');
    const totalEle = document.getElementById('cartTotal');

    if (subEle) subEle.textContent = '₹' + subtotal.toLocaleString('en-IN');
    if (wrapEle) wrapEle.textContent = '₹' + giftWrapCost.toLocaleString('en-IN');
    if (totalEle) totalEle.textContent = '₹' + total.toLocaleString('en-IN');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cartCount');
    if (counter) {
        counter.textContent = count;
        counter.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) return;

    closeCart();

    let subtotal = 0;
    let giftWrapCost = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        if (item.giftWrap) giftWrapCost += 50;
    });

    const total = subtotal + giftWrapCost;
    const checkoutTotal = document.getElementById('checkoutTotalAmount');
    if (checkoutTotal) checkoutTotal.textContent = '₹' + total.toLocaleString('en-IN');

    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function placeOrder(event) {
    if (event) event.preventDefault();

    const orderData = {
        customer: {
            name: document.getElementById('checkoutName')?.value || '',
            mobile: document.getElementById('checkoutMobile')?.value || '',
            email: document.getElementById('checkoutEmail')?.value || 'Not provided',
            address: document.getElementById('checkoutAddress')?.value || '',
            city: document.getElementById('checkoutCity')?.value || '',
            pincode: document.getElementById('checkoutPincode')?.value || ''
        },
        payment: document.querySelector('input[name="payment"]:checked')?.value || 'upi',
        items: cart,
        orderDate: new Date().toISOString()
    };

    console.log('Order placed:', orderData);

    // Clear cart
    cart = [];
    updateCartCount();

    // Close modal
    closeCheckout();

    // Show success message
    showNotification('🎉 Order Placed Successfully!');

    // Reset form
    document.getElementById('checkoutForm')?.reset();
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'shop-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
