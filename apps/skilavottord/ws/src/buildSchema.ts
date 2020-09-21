import { buildSchema } from '@island.is/infra-nest-server'

import { UserResolver } from './app/modules/user/user.resolver'

buildSchema({
  path: 'apps/skilavottord/ws/src/app/api.graphql',
  resolvers: [UserResolver],
})
