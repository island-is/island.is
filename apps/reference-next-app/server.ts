import { bootstrap } from '@island.is/infra-next-server'

bootstrap({
  name: 'reference-next-app',
  appDir: 'apps/reference-next-app',
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
