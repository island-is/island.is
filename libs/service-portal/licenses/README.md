# Service Portal Licenses

This module displays various licenses.

Ensure x-road services are active to run this module.

```bash
sh ./scripts/run-xroad-proxy.sh
```

## Driving License

The driving license section appears if the user holds a valid license. It shows details like issue date, expiration date, and categories. Users can generate a QR code for easy smartphone setup.

## Running Unit Tests

Execute `nx test service-portal-licenses` to run unit tests using [Jest](https://jestjs.io).
