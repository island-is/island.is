<!-- gitbook-ignore -->

# Air Discount Scheme Api

This service utilizes the AirDiscountSchemeApi

# How to use

Initialize the project with:
`yarn nx run api-domains-air-discount-scheme:dev-init`

Start the project in development mode with:
`yarn nx run api-domains-air-discount-scheme:dev`

X-road needs to be running

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```
