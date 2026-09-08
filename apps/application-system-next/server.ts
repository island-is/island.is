import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.config.json'

// Same endpoint `lib/graphql.ts` fetches screens from: the api gateway,
// cluster-internal in deploys and `:4444` locally. Read straight from the
// environment — Next 16 dropped `serverRuntimeConfig`, and the healthcheck
// callback is invoked without arguments.
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:4444'

bootstrap({
  name: 'application-system-next',
  appDir: 'apps/application-system-next',
  proxyConfig,
  externalEndpointDependencies: () => [`${INTERNAL_API_URL}/api/graphql`],
})
