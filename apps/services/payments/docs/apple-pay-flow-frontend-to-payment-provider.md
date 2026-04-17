# Apple Pay flow — frontend to payment provider

This document describes how **Apple Pay on the Web** is wired in the island.is stack: from the user’s browser through the **payments web app**, **GraphQL API**, **payments service**, and finally to the **payment gateway** (Valitor-compatible **Wallet Payment** API).

It is aimed at developers onboarding to the codebase or operating the flow in staging/production.

---

## 1. Components at a glance

| Layer | Role |
|-------|------|
| **User’s browser** | Runs Apple Pay JS (`ApplePaySession`). Talks to **Apple** for the sheet UI and payment token. |
| **Apple** | Merchant validation endpoints (`apple-pay-gateway*.apple.com`), and issues the encrypted payment token. |
| **apps/payments** (Next.js) | Creates the session, calls GraphQL for merchant validation and charge. |
| **GraphQL API** (`libs/api/domains/payments`) | Proxies to the payments service REST API via the generated **Payments** client. |
| **apps/services/payments** | Validates the payment flow, performs **mTLS** to Apple (merchant identity), **decrypts** the Apple token (payment processing key), calls the **payment gateway** `WalletPayment` with decrypted card data. |
| **Payment gateway** (configured URL) | HTTP API (e.g. Valitor) — `POST .../Payment/WalletPayment` with `DecryptedPaymentTokenData` for Apple Pay. |

---

## 2. End-to-end sequence (two phases)

Apple Pay on the Web splits into:

1. **Merchant validation** — prove to Apple that your web origin is allowed to use your Merchant ID (server-to-Apple call using **Merchant Identity** certificate).
2. **Payment authorization** — user authorizes; browser gives you a **payment token**; your backend decrypts it and sends card-like data to the **acquirer/gateway** (**Payment Processing** certificate + gateway API).

### Phase A — Merchant validation (`onvalidatemerchant`)

1. User taps Apple Pay; the frontend creates `new ApplePaySession(version, paymentRequest)` and calls `begin()`.
2. Safari triggers **`onvalidatemerchant`** with a **`validationURL`** (hosted by Apple).
3. The frontend calls GraphQL mutation **`paymentsValidateApplePayMerchant`** with `{ validationURL }`.
   - Implementation: `apps/payments/hooks/useApplePay.ts` (`validateApplePayMerchantMutation`).
4. The API domain calls the payments service REST API (generated client): **`POST .../payments/card/v1/apple-pay/validate-merchant`** (Nest controller: `path: 'payments/card'`, `version: ['1']` — global API prefix may prepend further in deployment).
5. **`CardPaymentService.validateApplePayMerchant`** (`cardPayment.service.ts`):
   - Builds a JSON body: `merchantIdentifier`, `displayName`, `initiative: 'web'`, `initiativeContext` (configured domain, e.g. `island.is`).
   - Uses **client TLS** (Merchant Identity **cert + key** PEM) via `generateApplePayValidationRequestOptions` in `cardPayment.utils.ts`.
   - **`fetch(validationURL, …)`** — **POST** to Apple’s gateway URL the browser supplied.
6. Apple responds with session payload (JSON). The service returns `{ session: JSON.stringify(data) }`.
7. The frontend **`JSON.parse`s** the session string and calls **`completeMerchantValidation(parsedSession)`** on the `ApplePaySession`.

**Security note:** The validation URL host is **allowlisted** (`applePay.constants.ts`) to Apple’s production and sandbox gateway hostnames only.

### Phase B — Charge (`onpaymentauthorized`)

1. After the user approves, the browser fires **`onpaymentauthorized`** with `event.payment.token` (includes **`paymentData`** — encrypted — and metadata).
2. The frontend calls GraphQL mutation **`paymentsChargeApplePay`** with:
   - `paymentFlowId`
   - `paymentData`, `paymentMethod`, `transactionIdentifier` from the token  
   - See `useApplePay.ts` → `chargeApplePayMutationHook`.
3. The API resolves to **`POST .../payments/card/v1/apple-pay/charge`** on the payments service (`cardPayment.controller.ts`).
4. The controller runs the **Apple Pay payment saga** (`applePayPayment.saga.ts`) via `PaymentOrchestrator`.

**Saga steps (high level):**

| Step | Purpose |
|------|--------|
| **VALIDATE** | Ensures the payment flow exists, is chargeable, and totals match (shared with card flow). |
| **CHARGE_APPLE_PAY** | Decrypts Apple **`EC_v1`** token, builds **WalletPayment** body, **`POST`** to `{paymentsGatewayApiUrl}/Payment/WalletPayment`. Logs “payment started”. |
| **PERSIST_PAYMENT_CONFIRMATION** | Records success in our domain (payment confirmation / fulfillment). |
| **NOTIFY_SUCCESSFUL_PAYMENT** | Logs completion for upstream observability. |

If the charge succeeds but a later step fails, the saga can **refund** via `refundService` and surface specific error codes (see controller error handling).

5. **`chargeApplePay`** in `cardPayment.service.ts`:
   - Requires **`APPLE_PAY_PAYMENT_PROCESSING_CERT`** and **`APPLE_PAY_PAYMENT_PROCESSING_KEY`**.
   - **`decryptApplePayPaymentToken`** — ECDH + AES-GCM to recover PAN, expiry, and **online payment cryptogram** (`cardPayment.utils.ts`).
   - **`generateApplePayDecryptedChargeRequestOptions`** — JSON body with `walletPaymentType: 'ApplePay'`, `DecryptedPaymentTokenData` (amount, card number, expiry, cryptogram, currency `ISK`), plus correlation / merchant reference data.
   - **`fetch`** to **`/Payment/WalletPayment`** on the configured gateway base URL.

6. On success, the frontend calls **`completePayment({ status: SUCCESS })`**; on failure, **`STATUS_FAILURE`**.

---

## 3. Data flow diagram (text)

```text
[Browser / Apple Pay JS]
        |
        |  validationURL
        v
[GraphQL: paymentsValidateApplePayMerchant]
        |
        v
[Payments service: validateApplePayMerchant]
        |  mTLS (Merchant Identity cert/key)
        v
[Apple Pay Gateway (apple-pay-gateway*.apple.com)]
        |
        |  session JSON
        v
[Browser: completeMerchantValidation]

--- user authorizes ---

[Browser: payment token]
        |
        v
[GraphQL: paymentsChargeApplePay]
        |
        v
[Payments service: saga -> chargeApplePay]
        |  decrypt token (Payment Processing cert/key)
        |  HTTPS + API auth headers
        v
[Payment gateway: POST /Payment/WalletPayment]
```

---

## 4. Cryptography (what each Apple certificate is for)

| Secret / cert | Used where | Purpose |
|---------------|------------|--------|
| **Merchant Identity** cert + key | `validateApplePayMerchant` → `fetch` to Apple | **mTLS client authentication** when POSTing the merchant validation JSON to Apple’s gateway. |
| **Payment Processing** cert + key | `decryptApplePayPaymentToken` | Decrypts **`EC_v1`** `paymentData` to obtain PAN, expiry, and cryptogram for the gateway. |
| **Merchant ID** string | Validation JSON + app config | Identifies the merchant to Apple; must match Apple Pay configuration for the site. |

Only **`EC_v1`** token version is supported (`decryptApplePayPaymentToken`).

---

## 5. Payment gateway contract (this codebase)

The charge path uses the **merchant-decrypted** Apple Pay flow with a `Sale` operation:

- **Endpoint:** `{paymentsGatewayApiUrl}/Payment/WalletPayment`
- **Payload shape:** `ApplePayDecryptedWalletPaymentPayload` in `cardPayment.utils.ts`:
  - `operation: 'Sale'`
  - `walletPaymentType: 'ApplePay'`
  - `applePayWalletPayment.DecryptedPaymentTokenData` — `Amount`, `CardNumber`, `Currency`, `ExpirationMonth`, `ExpirationYear`, `PaymentCryptogram`
  - `paymentAdditionalData` — `merchantReferenceData`
  - `systemCalling`, `correlationId`

The server decrypts the Apple Pay EC_v1 token using the **Payment Processing** cert/key to obtain the card number, expiry, and payment cryptogram, then sends these as `DecryptedPaymentTokenData` to the gateway.

The gateway is the **card payment provider** configured for the environment (URL and credentials come from payment gateway config; not hardcoded in this doc).

---

## 6. Feature flags and config

- **Payments service REST** (`cardPayment.controller.ts`): Apple Pay routes are guarded by **`Features.isIslandisApplePayPaymentEnabled`**.
- **GraphQL** (`payments.resolver.ts`): The resolver lives under the payments domain, which is gated by **`Features.isIslandisPaymentEnabled`** at resolver level (see `@FeatureFlag` on the resolver class).
- **Frontend** (`useApplePay.ts`): `publicRuntimeConfig.allowApplePay === 'true'` and user-level enablement must be true; the flow must also be available for **card** on the payment flow (`availablePaymentMethods` includes `'card'`).

**Domain / display config** (examples): `PAYMENTS_APPLE_PAY_DOMAIN`, `PAYMENTS_APPLE_PAY_DISPLAY_NAME` (see `cardPayment.config.ts` and `infra/payments.ts`).

---

## 7. Key source files (for navigation)

| Area | Path |
|------|------|
| Browser hook | `apps/payments/hooks/useApplePay.ts` |
| GraphQL mutations | `apps/payments/graphql/mutations.graphql.ts` |
| API resolver + service | `libs/api/domains/payments/src/lib/payments.resolver.ts`, `payments.service.ts` |
| REST controller | `apps/services/payments/src/app/cardPayment/cardPayment.controller.ts` |
| Apple Pay charge + validation | `apps/services/payments/src/app/cardPayment/cardPayment.service.ts` |
| Saga | `apps/services/payments/src/app/cardPayment/applePayPayment.saga.ts` |
| Utils (mTLS, decrypt, gateway body) | `apps/services/payments/src/app/cardPayment/cardPayment.utils.ts` |
| Validation URL allowlist | `apps/services/payments/src/app/cardPayment/applePay.constants.ts` |

---

## 8. Differences from card (3DS) flow

- **No 3DS card verification step** for Apple Pay in this flow: the user’s bank is handled inside Apple’s sheet; our backend does **not** use the same `verifyCard` / `verificationCallback` cache as the **card** charge path.
- The **charge** path goes to **`WalletPayment`** instead of **`CardPayment`**.

---

## 9. Operational notes

- **Sandbox vs production:** Apple uses different validation hosts; both are allowlisted. Ensure the **Merchant Identity** and **Payment Processing** certificates match the environment Apple expects (sandbox vs production).
- **Failures during merchant validation:** Check mTLS cert/key, Merchant ID, domain (`initiativeContext`), and that the validation URL was not tampered with (allowlist).
- **Failures during charge:** Check decryption keys, token version `EC_v1`, gateway credentials, and amount/currency consistency with the payment flow.

---

*This document reflects the implementation in the repository. If the gateway URL paths or GraphQL names change, update this file and the OpenAPI spec together.*
