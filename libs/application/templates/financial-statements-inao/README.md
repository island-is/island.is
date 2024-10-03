# Application Template Financial Statements

This library was generated with [Nx](https://nx.dev).

### Setup

Set AWS environment variables (from https://island-is.awsapps.com/start) for local document upload:

```bash
export AWS_ACCESS_KEY_ID="<access_key_id>"
export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
export AWS_SESSION_TOKEN="<session_token>"
```

### Running Locally

Start development services:

```bash
yarn nx run application-system-api:dev-services
yarn nx run application-system-api:migrate
```

Set up proxies:

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Run the application system:

```bash
yarn start application-system-form
yarn start api
yarn start application-system-api
```

Visit: `http://localhost:4242/umsoknir/skilarsreikninga`

## Test Users

**Gervimaður Færeyjar**: `01012399`

### Company Representation

- As a political party: **65°ARCTIC ehf.**
- As a Cemetery: **Blámi-fjárfestingafélag ehf.**

### Registering Board Members and Examiners

Use Gervimenn locally and on dev:

- **0101302989 Gervimaður Ameríka**
- **0101302129 Gervimaður Noregur**
