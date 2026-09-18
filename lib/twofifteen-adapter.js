const {
  PRODUCT_MAP,
  getProductMapping,
  mappingReadiness
} = require("./product-map");

class BridgeError extends Error {
  constructor(code, message, status = 400, details = null) {
    super(message);
    this.name = "BridgeError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseAddress(input = {}) {
  return {
    name: cleanText(input.name),
    address1: cleanText(input.address1),
    address2: cleanText(input.address2),
    city: cleanText(input.city),
    county: cleanText(input.county),
    postcode: cleanText(input.postcode),
    country: cleanText(input.country),
    email: cleanText(input.email),
    phone: cleanText(input.phone)
  };
}

function validateOrderInput(input = {}) {
  const orderRef = cleanText(input.orderRef);
  const productKey = cleanText(input.productKey);
  const quantity = Number(input.quantity || 1);
  const variant = cleanText(input.variant);
  const product = getProductMapping(productKey);

  if (!orderRef) {
    throw new BridgeError("ORDER_REF_REQUIRED", "orderRef is required.", 400);
  }

  if (!product) {
    throw new BridgeError(
      "UNKNOWN_PRODUCT",
      "productKey must be tee, hoodie or mug.",
      400
    );
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new BridgeError(
      "INVALID_QUANTITY",
      "quantity must be a whole number between 1 and 20.",
      400
    );
  }

  if (product.category === "apparel" && !variant) {
    throw new BridgeError(
      "VARIANT_REQUIRED",
      "A size/variant is required for apparel orders.",
      400
    );
  }

  const readiness = mappingReadiness(product);
  if (!readiness.ready) {
    throw new BridgeError(
      "PRODUCT_MAPPING_INCOMPLETE",
      `${product.name} is not fully mapped to Two Fifteen yet.`,
      422,
      { missing: readiness.missing }
    );
  }

  const shippingAddress = normaliseAddress(input.shippingAddress);
  const requiredAddress = ["name", "address1", "city", "postcode", "country"];
  const missingAddress = requiredAddress.filter(key => !shippingAddress[key]);

  if (missingAddress.length) {
    throw new BridgeError(
      "SHIPPING_ADDRESS_INCOMPLETE",
      "The shipping address is incomplete.",
      400,
      { missing: missingAddress }
    );
  }

  return {
    orderRef,
    quantity,
    variant: variant || null,
    product: {
      key: product.key,
      name: product.name,
      productCode: product.productCode,
      colour: product.colour,
      printAreas: product.printAreas
    },
    shippingAddress,
    customerNote: cleanText(input.customerNote) || null
  };
}

function authContractStatus() {
  const mode = cleanText(process.env.TWO_FIFTEEN_AUTH_MODE).toLowerCase();

  if (mode === "basic") {
    return { configured: true, mode: "basic" };
  }

  if (mode === "headers") {
    const appHeader = cleanText(process.env.TWO_FIFTEEN_APP_ID_HEADER);
    const secretHeader = cleanText(process.env.TWO_FIFTEEN_SECRET_HEADER);
    return {
      configured: Boolean(appHeader && secretHeader),
      mode: "headers"
    };
  }

  return { configured: false, mode: null };
}

function getBridgeStatus() {
  const auth = authContractStatus();
  const products = {};

  Object.entries(PRODUCT_MAP).forEach(([key, product]) => {
    const state = mappingReadiness(product);
    products[key] = {
      mapped: state.ready,
      missing: state.missing
    };
  });

  const credentialsConfigured = Boolean(
    cleanText(process.env.TWO_FIFTEEN_APP_ID) &&
    cleanText(process.env.TWO_FIFTEEN_SECRET_KEY)
  );

  const endpointConfigured = Boolean(cleanText(process.env.TWO_FIFTEEN_ORDER_URL));
  const liveFlag = process.env.TWO_FIFTEEN_LIVE_SUBMIT === "true";

  return {
    credentialsConfigured,
    internalTokenConfigured: Boolean(cleanText(process.env.BSB_API_INTERNAL_TOKEN)),
    endpointConfigured,
    authContractConfigured: auth.configured,
    authMode: auth.mode,
    liveSubmitRequested: liveFlag,
    adapterImplemented: false,
    readyForLiveOrders: false,
    products
  };
}

function serialiseOrderForTwoFifteen() {
  throw new BridgeError(
    "API_CONTRACT_REQUIRED",
    "Two Fifteen's direct order endpoint payload/authentication contract must be confirmed before live orders can be enabled.",
    503
  );
}

async function submitOrder(normalisedOrder) {
  if (process.env.TWO_FIFTEEN_LIVE_SUBMIT !== "true") {
    throw new BridgeError(
      "LIVE_SUBMIT_DISABLED",
      "Live Two Fifteen submission is disabled.",
      503
    );
  }

  // Deliberately calls a non-implemented serializer. This prevents accidental
  // paid customer orders from being sent using a guessed supplier payload.
  return serialiseOrderForTwoFifteen(normalisedOrder);
}

module.exports = {
  BridgeError,
  getBridgeStatus,
  submitOrder,
  validateOrderInput
};
