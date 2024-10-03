````markdown
# Portals Admin Regulations Admin

This library was generated with [Nx](https://nx.dev).

## Running a Minimal Development Environment

To set up the development environment, follow these steps after obtaining fresh AWS credentials. Open six (6) terminal windows:

1. Run Elasticsearch Proxy:
   ```sh
   sh scripts/run-es-proxy.sh
   ```
````

2. Start the Docker Compose for the backend:

   ```sh
   docker compose -f apps/services/regulations-admin-backend/docker-compose.yml up
   ```

   For setup details, see [the README.md](../../../services/../../apps/services/regulations-admin-backend/Readme.md).

3. Start the Regulations Admin Backend:
   ```sh
   yarn start regulations-admin-backend
   ```
4. Start the API:
   ```sh
   yarn start api
   ```
5. Start the Portals Admin:
   ```sh
   yarn start portals-admin
   ```

Once everything is running, open [http://localhost:4200/stjornbord/reglugerdir-admin](http://localhost:4200/stjornbord/reglugerdir-admin) in your browser to start using the application.

## Downloading PDFs

To enable the downloading of PDF files, run:

```sh
yarn start download-service
```

PDF files can be downloaded by following these steps:

- Request a download using `downloadRegulation` with the regulation ID as input.
- If the requested regulation is a draft, an object is returned with a URL for the `download-service` and a boolean indicating it is a `download-service` file.
- The `download-service` fetches all necessary data from the admin database and posts to the API server, which returns a Base64-encoded PDF.

## Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), use the following command:

```sh
nx test service-portal-regulations-admin
```

```

```
