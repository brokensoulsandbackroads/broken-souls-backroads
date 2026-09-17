(function(){
  if (typeof PRODUCTS === "undefined" || !PRODUCTS.tee) return;

  const teeImage = "assets/bsb-same-roads-tee-preview.jpg";

  PRODUCTS.tee.name = "Same Roads, Different Stories Tee";
  PRODUCTS.tee.image = teeImage;
  PRODUCTS.tee.description = "Unisex heather-grey BS&B graphic tee with the Same Roads, Different Stories artwork printed large on the front.";
  PRODUCTS.tee.notes = "Design mockup ready. Sourcing and sample testing are still in progress. Final garment, available sizes, print quality, delivery cost and retail price will be confirmed before checkout goes live.";

  const button = document.querySelector('.quick-view[data-product="tee"]');
  const card = button ? button.closest('.store-card') : null;
  if (!card) return;

  const wrap = card.querySelector('.product-image-wrap');
  const img = wrap ? wrap.querySelector('img') : null;
  const badge = wrap ? wrap.querySelector('.product-badge') : null;
  const title = card.querySelector('.product-body h3');
  const copy = card.querySelector('.product-copy');
  const note = card.querySelector('.product-option-note');

  if (img) {
    img.src = teeImage;
    img.alt = "Same Roads, Different Stories unisex T-shirt mockup";
    img.style.objectFit = "contain";
    img.style.background = "#fff";
  }
  if (badge) badge.textContent = "New Design";
  if (title) title.textContent = PRODUCTS.tee.name;
  if (copy) copy.textContent = "Unisex heather-grey tee with the Same Roads, Different Stories artwork printed large on the front.";
  if (note) note.innerHTML = "Sample & sourcing<br>in progress";
})();
