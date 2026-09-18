const { getBridgeStatus } = require("../lib/twofifteen-adapter");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const bridge = getBridgeStatus();

  return res.status(200).json({
    service: "bsb-twofifteen-bridge",
    mode: "safe",
    message: "Credentials are checked server-side only. Live supplier submission remains blocked until the direct Two Fifteen API contract is confirmed.",
    bridge
  });
};
