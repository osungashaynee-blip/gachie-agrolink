const products = [
  { id: 1, img: "images/red-onion-01.jpg", name: "Fresh Red Onions", desc: "Farm-fresh red onions. Mild, colorful, and perfect for salads and pickling.", price: 4.49 },
];

const cart = {};

const productsEl = document.getElementById("products");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderProducts() {
  productsEl.innerHTML = products.map(p => `
    <div class="card">
      <img class="photo" src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((n, [, q]) => n + q, 0);
  const total = entries.reduce((sum, [id, q]) => {
    const p = products.find(p => p.id === +id);
    return sum + p.price * q;
  }, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = "$" + total.toFixed(2);

  cartItemsEl.innerHTML = entries.length
    ? entries.map(([id, q]) => {
        const p = products.find(p => p.id === +id);
        return `
          <div class="cart-item">
            <div>
              <div class="name">${p.name}</div>
              <div class="qty">$${p.price.toFixed(2)} × ${q}</div>
            </div>
            <button onclick="removeFromCart(${id})">Remove</button>
          </div>
        `;
      }).join("")
    : `<p class="empty">Your cart is empty.</p>`;
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

checkoutBtn.addEventListener("click", () => {
  if (!Object.keys(cart).length) return alert("Your cart is empty!");
  alert("Thanks for your order! (Demo — connect a payment provider to take real orders.)");
  for (const k in cart) delete cart[k];
  renderCart();
  closeCartDrawer();
});

renderProducts();
renderCart();

const galleryGrid = document.getElementById("galleryGrid");
galleryGrid.innerHTML = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `<img src="images/red-onion-${n}.jpg" alt="Red onion photo ${i + 1}" loading="lazy">`;
}).join("");
