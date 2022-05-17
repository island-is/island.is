<!-- gitbook-navigation: "Health" -->

# Next Health Module

This library provides a wrapper that add `/readiness` and `/liveness` routes used by DevOps to check Next app's health.

## Setup

To setup you first need to create `next-modules/withHealthcheckConfig.js` in the project directory
which requires the `withHealthcheckConfig.js` from this library:

```javascript
// Note: Make sure to check the folder path navigation for your project
module.exports = require('../../../../libs/next/health/withHealthcheckConfig')
```

Then in your \_app.tsx (or similar) add:

```javascript
// Here is App component defined

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint, apiUrl]

export default withHealthchecks(externalEndpointDependencies)(
  // Other wrappers like appollo or locale
  App,
)
```

## Running unit tests

Run `nx test next-health` to execute the unit tests via [Jest](https://jestjs.io).
