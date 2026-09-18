const crypto = require("crypto");
const {
  BridgeError,
  submitOrder,
  validateOrderInput
} = require("../../lib/twofifteen-adapter");

function safeEqual(a, b) {
  const left = Buffer.from(a || "");
  const right = Buffer.from(b || "");

  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function bearerToken(req) {
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : "";
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedToken = process.env.BSB_API_INTERNAL_TOKEN || "";
  if (!expectedToken) {
    return res.status(503).json({
      error: "API_NOT_CONFIGURED",
      message: "The private BS&B API token has not been configured on the server."
    });
  }

  if (!safeEqual(bearerToken(req), expectedToken)) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "A valid server-side bearer token is required."
    });
  }

  try {
    const draft = validateOrderInput(req.body || {});

    if (process.env.TWO_FIFTEEN_LIVE_SUBMIT !== "true") {
      return res.status(200).json({
        submitted: false,
        safeMode: true,
        message: "Order validated and normalised, but not sent to Two Fifteen. Live submission is intentionally disabled.",
        draft
      });
    }

    const result = await submitOrder(draft);
    return res.status(200).json({ submitted: true, result });
  } catch (error) {
    if (error instanceof BridgeError) {
      return res.status(error.status).json({
        error: error.code,
        message: error.message,
        details: error.details || undefined
      });
    }

    console.error("BS&B fulfilment bridge error", {
      name: error && error.name,
      message: error && error.message
    });

    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "The fulfilment bridge could not process this request."
    });
  }
};
