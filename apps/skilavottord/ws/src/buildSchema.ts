import { buildSchema } from '@island.is/infra-nest-server'
import { FjarsyslaResolver } from './app/modules/fjarsysla/fjarsysla.resolver'
import { GdprResolver } from './app/modules/gdpr/gdpr.resolver'
import { RecyclingPartnerResolver } from './app/modules/recycling.partner/recycling.partner.resolver'
import { RecyclingRequestResolver } from './app/modules/recycling.request/recycling.request.resolver'
import { SamgongustofaResolver } from './app/modules/samgongustofa/samgongustofa.resolver'
import { UserResolver } from './app/modules/user/user.resolver'
import { VehicleOwnerResolver } from './app/modules/vehicle.owner/vehicle.owner.resolver'
import { VehicleResolver } from './app/modules/vehicle/vehicle.resolver'

buildSchema({
  path: 'apps/skilavottord/ws/src/app/api.graphql',
  resolvers: [
    UserResolver,
    SamgongustofaResolver,
    FjarsyslaResolver,
    GdprResolver,
    RecyclingPartnerResolver,
    VehicleResolver,
    RecyclingRequestResolver,
    VehicleOwnerResolver,
  ],
})
