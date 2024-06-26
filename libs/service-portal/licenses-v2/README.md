# Service Portal Licenses

This modal displays various licenses.

To run this modal you must have x-road services running.

```bash
sh ./scripts/run-xroad-proxy.sh
```

### Driving License

Driving license is displayed if the user has one. Displays information regarding the license, issue date, expire date, license categories etc.
User can also generate QR code that can be scanned and there for be able to instantly setup license in their smartphone.

## Running unit tests

Run `nx test service-portal-licenses` to execute the unit tests via [Jest](https://jestjs.io).
