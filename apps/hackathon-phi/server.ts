import { bootstrap } from '@island.is/infra-next-server'

bootstrap({
  name: 'hackathon-phi',
  appDir: 'apps/hackathon-phi',
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
