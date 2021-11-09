# Criminal record application

This library was generated with [Nx](https://nx.dev).

## Setup

Run these two proxy clients for Þjóðskrá connection.

` ./scripts/run-xroad-proxy.sh`
`kubectl port-forward svc/socat-soffia 8443:443 -n socat`

Fetch secrets
yarn get-secrets application-system-form  
yarn get-secrets application-system-api  
yarn get-secrets api
yarn get-secrets service-portal

## Running unit tests

Run `nx test application-templates-criminal-record` to execute the unit tests via [Jest](https://jestjs.io).

## Code owners and maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- [Jón Bjarni]()
- [Jóhanna Agnes]()
