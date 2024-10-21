import { resolvers } from '@island.is/api/mocks/resolvers'
import { schema } from '@island.is/api/mocks/schema'
import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { isMockMode } from './isMockMode'
import { mockedInitialState } from './mockedInitialState'

const setupMocking = () => {
  if (isMockMode) {
    startMocking([
      createGraphqlHandler({ resolvers, schema, mask: '*/bff/api/graphql' }),
    ])
  }
}
export { isMockMode, mockedInitialState, setupMocking }
