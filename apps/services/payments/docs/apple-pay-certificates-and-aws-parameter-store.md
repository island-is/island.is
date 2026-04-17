# Apple Pay certificates and AWS Parameter Store — step-by-step guide

This document is for someone who has **not** created Apple Developer certificates or stored secrets in **AWS Systems Manager Parameter Store** before. Follow the sections in order. If anything in Apple’s website looks different (they update the UI occasionally), use Apple’s on-screen labels and the official links at the end.

**What you are setting up**

- Two **different** TLS certificates from Apple, each with its **own** private key:
  1. **Apple Pay Merchant Identity Certificate** — used when our server talks to Apple during “merchant validation” (proving we are allowed to show Apple Pay).
  2. **Apple Pay Payment Processing Certificate** — used when processing/decrypting the Apple Pay payment token for the actual charge.

- **Four** secret values in **AWS Parameter Store** (as `SecureString`), which the payments service maps to environment variables (names are fixed in code — see [Parameter names](#9-parameter-names-for-this-project)).

| Question | Answer |
|----------|--------|
| Which **Apple Developer** account / team owns the app and Merchant ID? | **island.is** Apple Developer account |
| Is the **Merchant ID** already created? If yes, what is the exact identifier string? | **Yes** — `merchant.is.island.payments` |
| Which **AWS account** (name or ID) and **region** host the parameters? | AWS account: **`island-is-production01`**. Region: **`eu-west-1`**  |
| Exact **parameter path prefix** (e.g. `/k8s/services-payments/...`)? | **`/k8s/services-payments/`** — see full names below |


**Parameter Store full names (production PEM secrets)**

Create each as **`SecureString`** in **`island-is-production01`** / **`eu-west-1`**:

- `/k8s/services-payments/APPLE_PAY_MERCHANT_IDENTITY_CERT`
- `/k8s/services-payments/APPLE_PAY_MERCHANT_IDENTITY_KEY`
- `/k8s/services-payments/APPLE_PAY_PAYMENT_PROCESSING_CERT`
- `/k8s/services-payments/APPLE_PAY_PAYMENT_PROCESSING_KEY`

These map to the **same** environment variable names (`APPLE_PAY_*`).

---

## 1. Concepts (plain language)

- **Merchant ID** — A string Apple assigns (looks like `merchant.com.example.app`). It identifies your business for Apple Pay. It is **not** secret by itself but must match what the app and server use.
- **Certificate** — A public file Apple signs that says “this key belongs to this Merchant ID use-case.” Our app loads it as **PEM text**.
- **Private key** — A secret file **you generate on your computer** when you create a “certificate signing request” (CSR). **Apple never shows you the private key** — if you lose it, you must create a new CSR and new certificate.
- **CSR (Certificate Signing Request)** — A small file you upload to Apple so they can issue a certificate tied to your key. You create it with **OpenSSL** (or Keychain on a Mac).
- **PEM** — Text format with lines like `-----BEGIN CERTIFICATE-----`. Our service expects these secrets as PEM **strings** (often loaded from environment variables filled from Parameter Store).

---

## 2. Prerequisites on your Windows machine

### 2.1 Install OpenSSL

OpenSSL is a command-line tool used to create keys, CSRs, and convert Apple’s `.cer` downloads to PEM.

Pick **one** of these:

1. **Git for Windows** (if your company already installs it) — OpenSSL is usually at  
   `C:\Program Files\Git\usr\bin\openssl.exe`
2. **Chocolatey** (if allowed): install OpenSSL from an elevated PowerShell.
3. **Win32 OpenSSL** from [Shining Light Productions](https://slproweb.com/products/Win32OpenSSL.html) — choose the Win64 “Light” or “Full” installer and add OpenSSL to your PATH.

**Check it works** — open **Command Prompt** or **PowerShell** and run:

```text
openssl version
```

You should see a version number, not “command not found.”

### 2.2 Create a working folder

Example:

```text
C:\work\apple-pay-secrets\
```

Store all generated `.key`, `.csr`, and `.pem` files **only** here (or another private folder). **Do not** sync this folder to public cloud drives or commit it to git.

### 2.3 Access you need

- **Apple Developer Program** — Account with permission to create **Certificates** and manage **Merchant IDs** (often the “Account Holder” or “Admin” role, or a custom role with those rights).
- **AWS** — Ability to create **SSM parameters** (`SecureString`) in the agreed account/region, or ask someone to create them while you provide the values through a secure channel.

---

## 3. Apple Developer — Merchant Identity Certificate

This certificate + private key correspond to:

- Parameter (conceptually): merchant identity **certificate** and **key**
- App env: `APPLE_PAY_MERCHANT_IDENTITY_CERT` and `APPLE_PAY_MERCHANT_IDENTITY_KEY`

### 3.1 Generate a private key and CSR

In your working folder, open **Command Prompt** or PowerShell **in that folder** (or `cd` into it).

**Step A — Generate a 2048-bit RSA private key**

```text
openssl genrsa -out merchant_identity.key 2048
```

This creates `merchant_identity.key`. **Back up this file** to a secure location — it is irreplaceable.

**Step B — Create the CSR**

```text
openssl req -new -key merchant_identity.key -out merchant_identity.csr
```

You will be prompted for fields (Country, Organization, etc.). Use your **organization’s legal details** as your security team directs. If Apple’s portal later shows an example **Common Name (CN)** for this certificate type, match Apple’s guidance.

**Important:** The file `merchant_identity.csr` is what you **upload to Apple**. The file `merchant_identity.key` stays **private** — never email it in plain text; never paste it into tickets.

### 3.2 Create the certificate in Apple’s portal

1. Go to [Apple Developer Account](https://developer.apple.com/account) and sign in.
2. Open **Certificates, Identifiers & Profiles**.
3. Go to **Certificates** → click the **+** button to add a certificate.
4. Choose **Apple Pay Merchant Identity Certificate** (wording may vary slightly).
5. Select the correct **Merchant ID** from the list.
6. Upload `merchant_identity.csr`.
7. Complete the wizard and **download** the certificate (often a `.cer` file). Save it as e.g. `merchant_identity.cer` in your working folder.

If you cannot find “Merchant Identity” in the list, your account role may be insufficient, or the Merchant ID may be missing — ask your Apple admin.

### 3.3 Convert Apple’s `.cer` to PEM (certificate)

Apple usually gives a **binary** (DER) `.cer`. Convert it:

```text
openssl x509 -inform DER -in merchant_identity.cer -out merchant_identity_cert.pem
```

If you get an error about format, try:

```text
openssl x509 -inform PEM -in merchant_identity.cer -out merchant_identity_cert.pem
```

Open `merchant_identity_cert.pem` in Notepad. You should see:

```text
-----BEGIN CERTIFICATE-----
...multiple lines of base64...
-----END CERTIFICATE-----
```

### 3.4 Prepare the private key as PEM

Your `merchant_identity.key` is often already PEM. Open it in Notepad and confirm it starts with `-----BEGIN` … `PRIVATE KEY-----`.

If you ever need to normalize (optional):

```text
openssl rsa -in merchant_identity.key -out merchant_identity_key.pem
```

Use the resulting `merchant_identity_key.pem` as the key file you store in Parameter Store.

**Files you need for AWS (Merchant Identity)**

| Local file | Role |
|------------|------|
| `merchant_identity_cert.pem` | **Certificate** → maps to `APPLE_PAY_MERCHANT_IDENTITY_CERT` |
| `merchant_identity_key.pem` (or `.key` if already PEM) | **Private key** → maps to `APPLE_PAY_MERCHANT_IDENTITY_KEY` |

---

## 4. Apple Developer — Payment Processing Certificate

This is a **separate** certificate and **separate** key from Merchant Identity. Do **not** reuse `merchant_identity.key`.

### 4.1 Where to create it in the portal

1. In **Certificates, Identifiers & Profiles**, go to **Identifiers**.
2. Open **Merchant IDs** and select **your** Merchant ID.
3. Find the section for **Apple Pay Payment Processing** (or similar).
4. Use **Create certificate** / **Generate** and follow the steps.

If the portal asks for a **new CSR**, continue below. If Apple’s flow differs (e.g. integrated CSR), follow **their** on-screen instructions.

### 4.2 Generate a new key and CSR (if required)

In the **same** working folder (or a subfolder named `payment-processing`):

```text
openssl genrsa -out payment_processing.key 2048
openssl req -new -key payment_processing.key -out payment_processing.csr
```

Upload `payment_processing.csr` when the Merchant ID page requests it. Download the resulting `.cer` from Apple.

### 4.3 Convert certificate to PEM

```text
openssl x509 -inform DER -in payment_processing.cer -out payment_processing_cert.pem
```

(Use `-inform PEM` if `DER` fails.)

### 4.4 Private key PEM

Same as before: ensure `payment_processing.key` (or a `.pem` copy) is PEM format.

**Files you need for AWS (Payment Processing)**

| Local file | Role |
|------------|------|
| `payment_processing_cert.pem` | **Certificate** → `APPLE_PAY_PAYMENT_PROCESSING_CERT` |
| `payment_processing.key` or `payment_processing_key.pem` | **Private key** → `APPLE_PAY_PAYMENT_PROCESSING_KEY` |

---

## 5. Non-secret configuration

The **Merchant ID string** (e.g. `merchant.is.example`) is usually stored as normal configuration, not as a high-rotation secret — your team may still put it in Parameter Store as a **String** or in app config. The env name used by the payments service is:

- `APPLE_PAY_MERCHANT_IDENTIFIER`

Confirm the exact value with whoever manages the iOS/web Apple Pay configuration.

---

## 6. AWS Parameter Store — concepts

- **Standard parameter** — Value size limit **4096 characters**. Each PEM should usually be **its own parameter** so you stay under the limit.
- **Advanced parameter** — Larger size limit (use if a single PEM with chain is too big — rare).
- **SecureString** — Encrypted at rest; use for **private keys** and **certificates**.
- **Region** — Parameters exist in **one region**. Create them in the region where the payments service runs (e.g. `eu-west-1` — **verify** with your team).

---

## 7. Putting secrets in Parameter Store (AWS Console)

Suitable for a first-time user who prefers a GUI.

1. Sign in to **AWS Console** → **Systems Manager** → **Parameter Store** (under **Application Management**).
2. **Create parameter**.
3. **Name**: use your team’s hierarchy, e.g.  
   `/your-org/prod/payments/apple-pay/merchant-identity-cert`  
   Repeat for each of the four secrets with **four different names** (see [section 9](#9-parameter-names-for-this-project)).
4. **Tier**: Standard (unless the value is too long).
5. **Type**: **SecureString**.
6. **KMS key**: use **alias/aws/ssm** unless your org requires a customer-managed key.
7. **Value**: paste the **entire** PEM file contents, including:

   - First line `-----BEGIN ...-----`
   - Last line `-----END ...-----`
   - **Real line breaks** — paste so each line is separate (like in Notepad with Word Wrap off).

8. **Create parameter**.

Repeat for the private keys and the other certificate.

**Common mistake:** Pasting PEM as a single long line without line breaks. TLS libraries often fail. If the console strips newlines, use the CLI method below or ask DevOps how they inject multiline secrets.

---

## 8. Putting secrets in Parameter Store (AWS CLI)

Useful for automation and sometimes easier for multiline PEM.

### 8.1 Install and configure AWS CLI

1. Install [AWS CLI v2 for Windows](https://aws.amazon.com/cli/).
2. Configure credentials (your IT team may give you SSO, access keys, or a role):

   ```text
   aws configure
   ```

   Or use `aws sso login` if your org uses IAM Identity Center.

3. Test:

   ```text
   aws sts get-caller-identity
   ```

### 8.2 Put one file into a parameter (PowerShell example)

Replace the path, parameter name, and region.

```powershell
aws ssm put-parameter `
  --region eu-west-1 `
  --name "/your-org/prod/payments/apple-pay/merchant-identity-cert" `
  --type SecureString `
  --value file://merchant_identity_cert.pem
```

For the **private key**:

```powershell
aws ssm put-parameter `
  --region eu-west-1 `
  --name "/your-org/prod/payments/apple-pay/merchant-identity-key" `
  --type SecureString `
  --value file://merchant_identity_key.pem
```

Use `file://` with the **full path** if you are not in the same folder:

```text
file://C:/work/apple-pay-secrets/merchant_identity_cert.pem
```

### 8.3 Updating an existing parameter

If the parameter already exists:

```powershell
aws ssm put-parameter `
  --region eu-west-1 `
  --name "/your-org/prod/payments/apple-pay/merchant-identity-cert" `
  --type SecureString `
  --value file://merchant_identity_cert.pem `
  --overwrite
```

---

## 9. Parameter names for this project

The **payments service** reads these **environment variable names** (values must be PEM strings). How they get **from** Parameter Store **to** env vars depends on your deployment (ECS task definition, Kubernetes, etc.) — your platform team maps SSM paths to these names.

| Secret | Typical env var name (application) |
|--------|--------------------------------------|
| Merchant Identity certificate PEM | `APPLE_PAY_MERCHANT_IDENTITY_CERT` |
| Merchant Identity private key PEM | `APPLE_PAY_MERCHANT_IDENTITY_KEY` |
| Payment Processing certificate PEM | `APPLE_PAY_PAYMENT_PROCESSING_CERT` |
| Payment Processing private key PEM | `APPLE_PAY_PAYMENT_PROCESSING_KEY` |
| Merchant ID string (often not “secret”) | `APPLE_PAY_MERCHANT_IDENTIFIER` |

The **SSM parameter full names** (e.g. `/org/prod/...`) are for **your** infrastructure convention — they do not have to match the env var names, as long as the deployment injects the right value into the right env var.

---

## 10. Verification (read-back)

**Console:** Open each parameter → **Show** decrypted value → visually check PEM headers.

**CLI:**

```text
aws ssm get-parameter --name "/your-org/prod/payments/apple-pay/merchant-identity-cert" --with-decryption --query "Parameter.Value" --output text
```

Confirm the output starts with `-----BEGIN`.

**Do not** post command output or PEM content in public chats or tickets.

---

## 11. Security checklist

- [ ] Private keys never committed to git or sent by unencrypted email.
- [ ] Working folder on disk restricted (only you / needed admins).
- [ ] All four secrets created as **SecureString** in the correct **AWS account** and **region**.
- [ ] IAM policy allows **only** the payments runtime role to `ssm:GetParameters` on these ARNs (principle of least privilege).
- [ ] Apple Developer account used is the **correct** team for production Merchant ID.
- [ ] `APPLE_PAY_MERCHANT_IDENTIFIER` matches the Merchant ID configured for Apple Pay in apps/websites.

---

## 12. Troubleshooting

| Problem | What to try |
|---------|-------------|
| OpenSSL “not recognized” | Add OpenSSL to PATH or use full path to `openssl.exe`. |
| `x509` conversion fails | Try `-inform DER` vs `-inform PEM`. |
| Apple rejects CSR | Regenerate CSR; check Apple’s current instructions for key size (RSA 2048 vs EC). |
| Parameter Store “parameter limit exceeded” | Split into separate parameters per file; use advanced tier if truly needed. |
| App still fails TLS to Apple | PEM missing newlines; wrong cert/key pair mixed; wrong Merchant ID. |

---

## 13. Official references

- [Apple Pay on the Web — Setting up your server](https://developer.apple.com/documentation/apple_pay_on_the_web/setting_up_your_server)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [AWS CLI `put-parameter`](https://docs.aws.amazon.com/cli/latest/reference/ssm/put-parameter.html)

---


*Document version: 1.1 — production Apple Pay answers filled for island.is (`island-is-production01`, Merchant ID `merchant.is.island.payments`). Section 14 remains for team-specific runbook contacts.*
