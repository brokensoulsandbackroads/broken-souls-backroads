const PRODUCTS = {
  tee: {
    name: "Broken Souls Tee",
    type: "Apparel",
    price: "£24.99",
    image: "assets/tee.jpg",
    description: "The everyday BS&B tee. Built for gigs, backroads and the days when surviving is enough.",
    notes: "Sourcing in progress. Sizes, garment specification and final stock details will be confirmed before this product goes live."
  },
  hoodie: {
    name: "Backroads Hoodie",
    type: "Apparel",
    price: "£44.99",
    image: "assets/hoodie.jpg",
    description: "Heavy roadside comfort with the Broken Souls & Backroads identity front and centre.",
    notes: "Sourcing in progress. Sizes, garment specification and final stock details will be confirmed before this product goes live."
  },
  hat: {
    name: "Trucker Hat",
    type: "Headwear",
    price: "£19.99",
    image: "assets/hat.jpg",
    description: "A worn-road trucker style cap for the BS&B crowd. Easy, practical and properly roadside.",
    notes: "Sourcing in progress. Final fit, colour and stock availability will be confirmed before launch."
  },
  mug: {
    name: "Coffee Club Mug",
    type: "Home & Road",
    price: "£14.99",
    image: "assets/mug.jpg",
    description: "For the first brew of the morning, the late-night writing session and every questionable life decision in between.",
    notes: "Sourcing in progress. Final capacity, finish and care information will be confirmed before launch."
  },
  poster: {
    name: "Motel Poster",
    type: "Prints",
    price: "£12.99",
    image: "assets/poster.jpg",
    description: "A slice of the Backroads Motel world for the wall. Dark country storytelling, printed.",
    notes: "Sourcing in progress. Final print size, paper specification and fulfilment method will be confirmed before launch."
  },
  roomKey: {
    name: "Room 11 Key",
    type: "Collectables",
    price: "£8.99",
    image: "assets/room-key.jpg",
    description: "A motel-key-style BS&B keepsake inspired by the rooms, stories and ghosts of the Backroads Motel.",
    notes: "Sourcing in progress. Decorative collectable. Final material and dimensions will be confirmed before launch."
  }
};

const paypalLinks = window.BSB_PAYPAL_LINKS || {};
const dialog = document.getElementById("product-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogType = document.getElementById("dialog-type");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogPrice = document.getElementById("dialog-price");
const dialogNotes = document.getElementById("dialog-notes");
const dialogPayPal = document.getElementById("dialog-paypal");
const dialogStatus = document.getElementById("dialog-status");

function validPayPalUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (
      url.hostname === "paypal.com" ||
      url.hostname.endsWith(".paypal.com") ||
      url.hostname === "paypal.me" ||
      url.hostname.endsWith(".paypal.me")
    );
  } catch {
    return false;
  }
}

function configurePayPalButton(button, productKey) {
  const url = paypalLinks[productKey];
  if (validPayPalUrl(url)) {
    button.classList.remove("checkout-pending");
    button.innerHTML = '<i class="fab fa-paypal"></i> Buy securely';
    button.dataset.checkoutReady = "true";
    button.setAttribute("aria-label", `Buy ${PRODUCTS[productKey].name} securely with PayPal`);
  } else {
    button.classList.add("checkout-pending");
    button.innerHTML = '<i class="fas fa-road-barrier"></i> Coming soon';
    button.dataset.checkoutReady = "false";
    button.setAttribute("aria-label", `${PRODUCTS[productKey].name} is coming soon`);
  }
}

function openPayPal(productKey) {
  const url = paypalLinks[productKey];
  if (validPayPalUrl(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

function openProduct(productKey) {
  const product = PRODUCTS[productKey];
  if (!product || !dialog) return;

  dialogImage.src = product.image;
  dialogImage.alt = `${product.name} product image`;
  dialogType.textContent = product.type;
  dialogTitle.textContent = product.name;
  dialogDescription.textContent = product.description;
  dialogPrice.textContent = product.price;
  dialogNotes.textContent = product.notes;
  dialogPayPal.dataset.product = productKey;
  configurePayPalButton(dialogPayPal, productKey);
  dialogStatus.textContent = validPayPalUrl(paypalLinks[productKey])
    ? "Checkout opens on PayPal's secure hosted payment page."
    : "This product is being sourced and is not available to buy yet.";

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

document.querySelectorAll(".paypal-buy[data-product]").forEach(button => {
  const key = button.dataset.product;
  configurePayPalButton(button, key);
  button.addEventListener("click", () => {
    if (!openPayPal(key)) openProduct(key);
  });
});

document.querySelectorAll(".quick-view[data-product]").forEach(button => {
  button.addEventListener("click", () => openProduct(button.dataset.product));
});

if (dialogPayPal) {
  dialogPayPal.addEventListener("click", () => {
    const key = dialogPayPal.dataset.product;
    if (!openPayPal(key)) {
      dialogStatus.textContent = "Coming soon. Checkout will only be enabled once the product is sourced, tested and ready to fulfil.";
    }
  });
}

const dialogClose = document.getElementById("dialog-close");
if (dialogClose) {
  dialogClose.addEventListener("click", () => dialog.close());
}

if (dialog) {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    document.querySelectorAll(".store-card").forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});
