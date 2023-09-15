# Application Template Financial Statements

This library was generated with [Nx](https://nx.dev).

### Setup

First you need to enter the AWS environment variables (get from https://island-is.awsapps.com/start) to be able to upload documents while running locally

`export AWS_ACCESS_KEY_ID="<access_key_id>"`

`export AWS_SECRET_ACCESS_KEY="<secret_access_key>"`

`export AWS_SESSION_TOKEN="<session_token>"`

### Running locally

start dev services:

```bash
yarn nx run application-system-api:dev-services
yarn nx run application-system-api:migrate
```

and both proxies

```bash
kubectl port-forward svc/socat-soffia 8443:443 -n socat
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

then run the application system

```bash
yarn start application-system-form
yarn start api
yarn start application-system-api
```

and visit `http://localhost:4242/umsoknir/skilarsreikninga`

## Test Users

**Gervimaður Færeyjar** `01012399`

### Company representation:

Act as a political party: **65°ARCTIC ehf.**

Act as a Cemetery: **Blámi-fjárfestingafélag ehf.**

### Registering Boardmembers and Examiners

Locally and on dev use Gervimenn f.x.

**0101302989 Gervimaður Ameríka**

**0101302129 Gervimaður Noregur**
