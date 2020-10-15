import { buildSchema } from '@island.is/infra-nest-server'

import { UserResolver, CaseResolver } from './app/modules'

buildSchema({
  path: 'apps/judicial-system/api.graphql',
  resolvers: [UserResolver, CaseResolver],
})
