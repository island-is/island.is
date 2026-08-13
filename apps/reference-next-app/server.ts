import { bootstrap } from '@island.is/infra-next-server'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'

bootstrap({
  name: 'reference-next-app',
  appDir: 'apps/reference-next-app',
  externalEndpointDependencies: () => {
    const { graphqlEndpoint } = getServerRuntimeEnv()
    return [graphqlEndpoint]
  },
})
