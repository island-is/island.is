<!-- gitbook-ignore -->

# API Domains Powerbi

This domain corresponds to Power Bi functionality for the web.
The web can embed Power Bi reports and some reports require an embed token, which this api domain can provide if given a workspace id, report id and an owner (which is a unique string that's used to map to the correct secret values).

## Running unit tests

Run `nx test api-domains-powerbi` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint api-domains-powerbi` to execute the lint via [ESLint](https://eslint.org/).
