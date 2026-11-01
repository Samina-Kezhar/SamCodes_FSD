/**
 * Modern E-Commerce Application Core JS
 * Handles Cart, Wishlist, Notifications & State Management
 */

// Helper to get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    return [];
  }
}

// Helper to save cart
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateBadges();
}

// Helper to get wishlist from localStorage
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch (e) {
    return [];
  }
}

// Helper to save wishlist
function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateBadges();
}

// Toast notification system
function showToast(message, type = 'primary') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check" style="color: #10B981;"></i>';
  if (type === 'accent') {
    icon = '<i class="fa-solid fa-heart" style="color: #EC4899;"></i>';
  } else if (type === 'danger') {
    icon = '<i class="fa-solid fa-trash-can" style="color: #EF4444;"></i>';
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Update navbar badges dynamically
function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();

  const cartBadges = document.querySelectorAll('.cart-badge-count');
  cartBadges.forEach(b => {
    const totalItems = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });

  const wishlistBadges = document.querySelectorAll('.wishlist-badge-count');
  wishlistBadges.forEach(b => {
    const totalItems = wishlist.length;
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Add item to cart with optional quantity
function addItemToCart(product, quantity = 1, silent = false) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.title === product.title);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity
    });
  }

  saveCart(cart);
  if (!silent) {
    showToast(`Added <strong>${product.title ? product.title.slice(0, 18) + '...' : 'Item'}</strong> to cart!`, 'primary');
  }
}

// Toggle wishlist item
function toggleWishlistItem(product) {
  const wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.title === product.title);

  if (index > -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    showToast(`Removed from wishlist`, 'danger');
    return false;
  } else {
    wishlist.push(product);
    saveWishlist(wishlist);
    showToast(`Added to wishlist! ❤️`, 'accent');
    return true;
  }
}

// Format currency
function formatPrice(amount) {
  const num = Number(amount) || 0;
  return '$' + num.toFixed(2);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();

  // Highlight active link in header
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.site-header .nav-link-btn');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') ? link.getAttribute('href').toLowerCase() : '';
    if (href && currentPath.includes(href.replace('./', ''))) {
      link.classList.add('active');
    } else if (
      (currentPath.endsWith('/') || currentPath.endsWith('/i.html') || currentPath.endsWith('/index.html')) &&
      (href === './i.html' || href === 'i.html' || href === './index.html')
    ) {
      link.classList.add('active');
    }
  });
});
