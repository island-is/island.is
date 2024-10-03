# Service Portal Licenses

This modal displays various licenses.

To run this modal, you must have X-Road services running.

```bash
sh ./scripts/run-xroad-proxy.sh
```

### Driving License

The driving license information is displayed if the user possesses a license. The modal provides details such as the license number, issue date, expiry date, and license categories. Additionally, users can generate a QR code that can be scanned to quickly set up the license on their smartphone.

## Running Unit Tests

Run `nx test service-portal-licenses` to execute the unit tests using [Jest](https://jestjs.io).