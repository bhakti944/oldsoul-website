function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));

  document.getElementById(id).classList.add('active');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});

function openQuickView(productCard) {
  const modal = document.getElementById('quickViewModal');
  modal.style.display = 'block';

  // Fetch data from clicked product
  const name = productCard.dataset.name;
  const price = productCard.dataset.price;
  const originalPrice = productCard.dataset.originalPrice;
  const rating = productCard.dataset.rating;
  const reviews = productCard.dataset.reviews;
  const images = productCard.dataset.images.split(',');

  document.getElementById('productName').innerText = name;
  document.getElementById('discountPrice').innerText = price;
  document.getElementById('originalPrice').innerText = originalPrice;

  // Only set rating if the element exists
  const ratingElement = document.getElementById('rating');
  if (ratingElement && rating && reviews) {
    ratingElement.innerText = generateStars(rating) + ' (' + reviews + ')';
  }

  // Populate scrollable images
  const imageScroll = document.getElementById('imageScroll');
  imageScroll.innerHTML = ''; // Clear existing images
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    imageScroll.appendChild(img);
  });
}

function closeQuickView() {
  document.getElementById('quickViewModal').style.display = 'none';
}

function addToCart(productName, price, specs) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Find existing item
  const existing = cart.find(item => item.name === productName);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseInt(price),  // FIX: Convert to number
      specs: specs,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  updateCheckoutSummary();
  updateCartCount();

  // Show confirmation
  alert('Product added to cart!');
}

function changeMainImage(img) {
  document.getElementById('mainImage').src = img.src;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  let stars = '⭐'.repeat(fullStars);
  if (halfStar) stars += '☆';
  while (stars.length < 5) stars += '☆';
  return stars;
}

// Close modal on clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('quickViewModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let html = '<div class="vintage-cart">';
  let total = 0;
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <div class="cart-details">
          <h3 class="vintage-title">${item.name} (x${item.quantity})</h3>
          <div class="vintage-specs">${item.specs}</div>
          <div style="font-weight:bold; color:#d4af37; font-size:1.1rem;">₹${item.price * item.quantity}</div>
          <button onclick="removeFromCart(${index})" style="margin-top:10px; background:#8b4513; color:#fff; border:none; padding:5px 10px; border-radius:5px;">Remove</button>
        </div>
      </div>
    `;
    total += item.price * item.quantity;
  });
  html += `
    <div class="total-section">
      <div class="vintage-total">Total: ₹${total}</div>
      <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
    </div>
  `;
  html += '</div>';
  cartItemsContainer.innerHTML = html;
}

// 4. FIXED Checkout Summary
function updateCheckoutSummary() {
  const summary = document.getElementById('orderSummary');
  if (!summary) return;

  summary.innerHTML = ''; // Clear old items
  let total = 0;

  // SHOW ALL 4 CART ITEMS
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'summary-item';
    itemDiv.innerHTML = `
      <span>${item.name} (x${item.quantity || 1})</span>
      <span>₹${item.price || 0}</span>
    `;
    summary.appendChild(itemDiv);
    total += (item.price || 0) * (item.quantity || 1);
  });

  // Gold line
  const goldLine = document.createElement('hr');
  goldLine.className = 'gold-line';
  summary.appendChild(goldLine);

  // Total row
  const totalDiv = document.createElement('div');
  totalDiv.className = 'total-row';
  totalDiv.innerHTML = `
    <span>Total:</span>
    <span class="grand-total">₹${total}</span>
  `;
  summary.appendChild(totalDiv);
}

// 5. REMOVE function (for Remove buttons)
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  updateCheckoutSummary();
  updateCartCount();
}
