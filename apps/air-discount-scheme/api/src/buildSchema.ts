import { buildSchema } from '@island.is/infra-nest-server'
import { CmsResolver } from '@island.is/api/domains/cms'
import {
  UserResolver,
  DiscountResolver,
  FlightResolver,
  FlightLegResolver,
} from './app/modules'

buildSchema({
  path: 'apps/air-discount-scheme/api.graphql',
  resolvers: [
    UserResolver,
    DiscountResolver,
    FlightResolver,
    FlightLegResolver,
    CmsResolver,
  ],
})
