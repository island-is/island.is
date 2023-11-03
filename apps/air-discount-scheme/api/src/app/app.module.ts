import { Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
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

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/air-discount-scheme/api/src/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
      dataSources: () => ({ backendApi: new BackendAPI() }),
      driver: ApolloDriver,
    }),
    AuthModule.register(environment.identityServerAuth),
    UserModule,
    DiscountModule,
    FlightModule,
    FlightLegModule,
    CmsModule,
  ],
})
export class AppModule {}
