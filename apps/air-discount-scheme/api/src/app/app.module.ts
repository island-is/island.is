import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CmsModule } from '@island.is/cms'

import {
  UserModule,
  DiscountModule,
  FlightModule,
  FlightLegModule,
} from './modules'
import { BackendAPI } from '../services'
import { environment } from '../environments'
import { AuthModule } from '@island.is/auth-nest-tools'
// import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
// import { ConfigModule, XRoadConfig } from '@island.is/nest/config'


const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/air-discount-scheme/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
      dataSources: () => ({ backendApi: new BackendAPI() }),
    }),
    AuthModule.register(environment.identityServerAuth),
    UserModule,
    DiscountModule,
    FlightModule,
    FlightLegModule,
    CmsModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [XRoadConfig, NationalRegistryClientConfig],
    // }),
  ],
})
export class AppModule {}
