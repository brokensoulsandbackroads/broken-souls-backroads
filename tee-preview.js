(function(){
  if (typeof PRODUCTS === "undefined") return;

  const tee = PRODUCTS.tee;
  if (tee) {
    const teeImage = "assets/bsb-same-roads-tee-preview.jpg";

    tee.name = "Same Roads, Different Stories Tee";
    tee.image = teeImage;
    tee.description = "Unisex heather-grey BS&B graphic tee with the Same Roads, Different Stories artwork printed large on the front.";
    tee.notes = "UK print-on-demand supplier confirmed. Sample testing is still pending before launch. Final sizes, print quality and live checkout will be confirmed once the sample is approved.";

    const button = document.querySelector('.quick-view[data-product="tee"]');
    const card = button ? button.closest('.store-card') : null;
    if (card) {
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
      if (badge) badge.textContent = "UK POD Confirmed";
      if (title) title.textContent = tee.name;
      if (copy) copy.textContent = "Unisex heather-grey tee with the Same Roads, Different Stories artwork printed large on the front.";
      if (note) note.innerHTML = "Supplier confirmed<br>sample pending";
    }
  }

  const hoodie = PRODUCTS.hoodie;
  if (hoodie) {
    hoodie.notes = "UK print-on-demand supplier confirmed for a 300gsm heavy hoodie with front and back DTG printing. Sample testing is still pending before launch. Final print quality, sizes and live checkout will be confirmed once the sample is approved.";

    const hoodieButton = document.querySelector('.quick-view[data-product="hoodie"]');
    const hoodieCard = hoodieButton ? hoodieButton.closest('.store-card') : null;
    if (hoodieCard) {
      const badge = hoodieCard.querySelector('.product-badge');
      const note = hoodieCard.querySelector('.product-option-note');
      if (badge) badge.textContent = "UK POD Confirmed";
      if (note) note.innerHTML = "Supplier confirmed<br>sample pending";
    }
  }

  const mug = PRODUCTS.mug;
  if (mug) {
    const mugImage = "assets/bsb-same-roads-mug-preview.jpg?v=3";

    mug.name = "Same Roads Two-Tone Mug";
    mug.price = "£16.99";
    mug.image = mugImage;
    mug.description = "11 oz two-tone ceramic BS&B mug with a black inner and handle, wrapped with the Same Roads, Different Stories artwork.";
    mug.notes = "UK print-on-demand supplier confirmed. Design mockup ready. Sample testing is still pending before launch, so checkout remains disabled until the physical print is approved.";

    const mugButton = document.querySelector('.quick-view[data-product="mug"]');
    const mugCard = mugButton ? mugButton.closest('.store-card') : null;
    if (mugCard) {
      const wrap = mugCard.querySelector('.product-image-wrap');
      const img = wrap ? wrap.querySelector('img') : null;
      const badge = wrap ? wrap.querySelector('.product-badge') : null;
      const title = mugCard.querySelector('.product-body h3');
      const copy = mugCard.querySelector('.product-copy');
      const price = mugCard.querySelector('.product-price');
      const note = mugCard.querySelector('.product-option-note');

      if (img) {
        img.src = mugImage;
        img.alt = "Same Roads Two-Tone Mug mockup showing left, centre and right views";
        img.style.objectFit = "contain";
        img.style.background = "#fff";
      }
      if (badge) badge.textContent = "Two-Tone • 11 oz";
      if (title) title.textContent = mug.name;
      if (copy) copy.textContent = "Black-inner, black-handle ceramic mug with the Same Roads, Different Stories wraparound artwork.";
      if (price) price.textContent = mug.price;
      if (note) note.innerHTML = "Supplier confirmed<br>sample pending";
    }
  }
})();