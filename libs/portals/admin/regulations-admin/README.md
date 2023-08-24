# Portals Admin Regulations Admin

This library was generated with [Nx](https://nx.dev).

## Running a minimal dev-env

Get fresh AWS credentials, and then open six (6) terminal windows.

1. `sh scripts/run-es-proxy.sh`
2. `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
3. `docker-compose -f apps/services/regulations-admin-backend/docker-compose.yml up`  
   (for setup see [the README.md](../../../services/../../apps/services/regulations-admin-backend/Readme.md))
4. `yarn start regulations-admin-backend`
5. `yarn start api`
6. `yarn start portals-admin`

Once everything is running, open <http://localhost:4200/stjornbord/reglugerdir-admin> and enjoy.

## Downloading PDFs

To be able to download PDF files, also start:

`yarn start download-service`

PDFs are downloaded by:

- Requesting a download via `downloadRegulation` with the regulation id as input
- If the requested regulation is a draft regulation, returns a object with a `download-service` url and a boolean that marks it as a download-service file
- `download-service` fetches all required data from the admin db and posts to the API server which returns a base64 of the PDF

## Running unit tests

Run `nx test service-portal-regulations-admin` to execute the unit tests via [Jest](https://jestjs.io).
