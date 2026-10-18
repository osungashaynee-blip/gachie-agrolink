const products = [
  { id: 1, img: "images/red-onion-01.jpg", name: "Fresh Red Onions — Retail", desc: "Farm-fresh red onions, sold per kg. Perfect for homes, restaurants, and small shops.", price: 95 },
  { id: 2, img: "images/red-onion-02.jpg", name: "Fresh Red Onions — Wholesale", desc: "Bulk farm-fresh red onions per kg. Minimum 10kg. For vendors and markets.", price: 80 },
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
const copyLinkBtn = document.getElementById("copyLinkBtn");

async function copySiteLink() {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  const original = copyLinkBtn.innerHTML;
  copyLinkBtn.innerHTML = "✓ Link copied!";
  copyLinkBtn.classList.add("copied");
  setTimeout(() => {
    copyLinkBtn.innerHTML = original;
    copyLinkBtn.classList.remove("copied");
  }, 2000);
}

copyLinkBtn.addEventListener("click", copySiteLink);

function renderProducts() {
  productsEl.innerHTML = products.map(p => `
    <div class="card">
      <img class="photo" src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="price">Ksh ${p.price.toFixed(2)}</div>
      <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const p = products.find(p => p.id === id);
  openOrderModal(p);
}

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const stepKg = document.getElementById("stepKg");
const stepContact = document.getElementById("stepContact");
const orderProductName = document.getElementById("orderProductName");
const orderUnitPrice = document.getElementById("orderUnitPrice");
const kgInput = document.getElementById("kgInput");
const kgError = document.getElementById("kgError");
const orderNext = document.getElementById("orderNext");
const orderSummary = document.getElementById("orderSummary");
const orderWhatsApp = document.getElementById("orderWhatsApp");
const orderCall = document.getElementById("orderCall");

let currentProduct = null;

function openOrderModal(p) {
  currentProduct = p;
  orderProductName.textContent = p.name;
  orderUnitPrice.textContent = "Ksh " + p.price.toFixed(2) + "/kg";
  kgInput.value = "";
  kgError.classList.remove("show");
  stepKg.classList.remove("hidden");
  stepContact.classList.add("hidden");
  orderModal.classList.add("show");
  kgInput.focus();
}

function closeOrderModal() {
  orderModal.classList.remove("show");
  currentProduct = null;
}

orderClose.addEventListener("click", closeOrderModal);
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) closeOrderModal();
});

orderNext.addEventListener("click", () => {
  const kg = parseFloat(kgInput.value);
  if (!kg || kg <= 0 || isNaN(kg)) {
    kgError.classList.add("show");
    kgInput.focus();
    return;
  }
  kgError.classList.remove("show");

  const total = currentProduct.price * kg;
  orderSummary.textContent = currentProduct.name + " — " + kg + " kg = Ksh " + total.toFixed(2);

  const msg = "Hello GACHIE AGROLINK! I'd like to order:\n\n"
    + currentProduct.name + "\n"
    + "Quantity: " + kg + " kg\n"
    + "Total: Ksh " + total.toFixed(2) + "\n\n"
    + "Please confirm availability. Thank you!";
  orderWhatsApp.href = "https://wa.me/254101817921?text=" + encodeURIComponent(msg);
  orderCall.href = "tel:+254745908475";

  stepKg.classList.add("hidden");
  stepContact.classList.remove("hidden");
});

kgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") orderNext.click();
});

const fabContact = document.getElementById("fabContact");
const contactModal = document.getElementById("contactModal");
const contactClose = document.getElementById("contactClose");

fabContact.addEventListener("click", () => contactModal.classList.add("show"));
contactClose.addEventListener("click", () => contactModal.classList.remove("show"));
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) contactModal.classList.remove("show");
});

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
  cartTotalEl.textContent = "Ksh " + total.toFixed(2);

  cartItemsEl.innerHTML = entries.length
    ? entries.map(([id, q]) => {
        const p = products.find(p => p.id === +id);
        return `
          <div class="cart-item">
            <div>
              <div class="name">${p.name}</div>
              <div class="qty">Ksh ${p.price.toFixed(2)} × ${q}</div>
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
  alert("Thanks for your order! Please complete your order via WhatsApp: https://wa.me/254101817921 or call 0745908475.");
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
