# Service Portal Regulations Admin

This library was generated with [Nx](https://nx.dev).

## Running a minimal dev-env

Get fresh AWS credentials, and then open six (6) terminal windows.

1. `sh scripts/run-es-proxy.sh`
2. `kubectl port-forward svc/socat-soffia 8443:443 -n socat`
3. `docker-compose -f apps/services/regulations-admin-backend/docker-compose.yml up`
4. `yarn start regulations-admin-backend` (for setup see [the README.md](../../services/../../apps/services/regulations-admin-backend/Readme.md))
5. `yarn start api`
6. `yarn start service-portal`

Once everything is running, open <http://localhost:4200/minarsidur/reglugerdir-admin> and enjoy.

## Running unit tests

Run `nx test service-portal-regulations-admin` to execute the unit tests via [Jest](https://jestjs.io).
