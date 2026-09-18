# BS&B Two Fifteen API Bridge

This branch contains the secure server-side bridge used to prepare Broken Souls & Backroads print-on-demand orders for Two Fifteen.

The storefront remains static. API credentials must never be placed in browser JavaScript, GitHub Pages files, or public configuration.

## Current safety state

The bridge is intentionally **not allowed to submit live supplier orders yet**. Two Fifteen currently confirms that integrations use an App ID and Secret Key, and that order items need a Two Fifteen product code, artwork link, print location and print type. However, the public documentation does not currently expose the direct order endpoint and request/authentication contract needed to safely create orders.

Until that contract is confirmed, `/api/twofifteen/order` validates and normalises an order but will not send it to Two Fifteen.

## Recommended host

Deploy this repository to a Node-compatible serverless host such as Vercel. GitHub Pages can continue serving the public storefront while the API is hosted separately.

## Environment variables

Copy `.env.example` into the host's private environment-variable settings. Never commit `.env` or real secrets.

Required for configuration checks:

- `TWO_FIFTEEN_APP_ID`
- `TWO_FIFTEEN_SECRET_KEY`
- `BSB_API_INTERNAL_TOKEN`

Required once Two Fifteen confirms the direct API contract:

- `TWO_FIFTEEN_ORDER_URL`
- `TWO_FIFTEEN_AUTH_MODE`
- `TWO_FIFTEEN_APP_ID_HEADER` when header auth is required
- `TWO_FIFTEEN_SECRET_HEADER` when header auth is required

Product mappings:

- `TWO_FIFTEEN_TEE_PRODUCT_CODE`
- `TWO_FIFTEEN_TEE_FRONT_ART_URL`
- `TWO_FIFTEEN_HOODIE_PRODUCT_CODE`
- `TWO_FIFTEEN_HOODIE_FRONT_ART_URL`
- `TWO_FIFTEEN_HOODIE_BACK_ART_URL`
- `TWO_FIFTEEN_MUG_PRODUCT_CODE`
- `TWO_FIFTEEN_MUG_WRAP_ART_URL`

Print-location and print-type values are environment variables too because the exact supplier strings must match Two Fifteen's API contract.

## Routes

### `GET /api/status`

Returns only booleans and readiness information. It never returns the App ID, Secret Key, internal token, or any other credential.

### `POST /api/twofifteen/order`

Private server-to-server route. Requires:

`Authorization: Bearer <BSB_API_INTERNAL_TOKEN>`

It accepts a BS&B product key (`tee`, `hoodie`, or `mug`), quantity, variant and shipping address, then builds a normalised fulfilment draft. Live supplier submission remains blocked until the direct Two Fifteen API contract is implemented in `lib/twofifteen-adapter.js`.

## Safe launch sequence

1. Approve physical product samples.
2. Deploy the API to a serverless host.
3. Add the App ID and Secret Key as private environment variables.
4. Confirm Two Fifteen's exact direct API order endpoint, auth scheme and payload format.
5. Complete `lib/twofifteen-adapter.js` and test using a non-customer order.
6. Add verified PayPal server-side payment/webhook handling.
7. Only then enable automatic paid-order fulfilment.
