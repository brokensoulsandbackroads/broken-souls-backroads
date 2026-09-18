function area(artworkUrl, location, printType) {
  return {
    artworkUrl: artworkUrl || "",
    location: location || "",
    printType: printType || ""
  };
}

const PRODUCT_MAP = {
  tee: {
    key: "tee",
    name: "Same Roads, Different Stories Tee",
    category: "apparel",
    colour: "Heather Grey",
    productCode: process.env.TWO_FIFTEEN_TEE_PRODUCT_CODE || "",
    printAreas: [
      area(
        process.env.TWO_FIFTEEN_TEE_FRONT_ART_URL,
        process.env.TWO_FIFTEEN_TEE_FRONT_LOCATION,
        process.env.TWO_FIFTEEN_TEE_FRONT_TYPE
      )
    ]
  },
  hoodie: {
    key: "hoodie",
    name: "BS&B Roadside Hoodie",
    category: "apparel",
    colour: "Black",
    productCode: process.env.TWO_FIFTEEN_HOODIE_PRODUCT_CODE || "",
    printAreas: [
      area(
        process.env.TWO_FIFTEEN_HOODIE_FRONT_ART_URL,
        process.env.TWO_FIFTEEN_HOODIE_FRONT_LOCATION,
        process.env.TWO_FIFTEEN_HOODIE_FRONT_TYPE
      ),
      area(
        process.env.TWO_FIFTEEN_HOODIE_BACK_ART_URL,
        process.env.TWO_FIFTEEN_HOODIE_BACK_LOCATION,
        process.env.TWO_FIFTEEN_HOODIE_BACK_TYPE
      )
    ]
  },
  mug: {
    key: "mug",
    name: "Same Roads Two-Tone Mug",
    category: "home",
    colour: "White / Black",
    productCode: process.env.TWO_FIFTEEN_MUG_PRODUCT_CODE || "",
    printAreas: [
      area(
        process.env.TWO_FIFTEEN_MUG_WRAP_ART_URL,
        process.env.TWO_FIFTEEN_MUG_WRAP_LOCATION,
        process.env.TWO_FIFTEEN_MUG_WRAP_TYPE
      )
    ]
  }
};

function getProductMapping(key) {
  return PRODUCT_MAP[key] || null;
}

function mappingReadiness(product) {
  if (!product) {
    return { ready: false, missing: ["product"] };
  }

  const missing = [];

  if (!product.productCode) missing.push("productCode");

  product.printAreas.forEach((item, index) => {
    if (!item.artworkUrl) missing.push(`printAreas[${index}].artworkUrl`);
    if (!item.location) missing.push(`printAreas[${index}].location`);
    if (!item.printType) missing.push(`printAreas[${index}].printType`);
  });

  return {
    ready: missing.length === 0,
    missing
  };
}

module.exports = {
  PRODUCT_MAP,
  getProductMapping,
  mappingReadiness
};
