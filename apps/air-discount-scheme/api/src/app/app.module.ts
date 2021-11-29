import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CmsModule } from '@island.is/cms'

import {
  AuthModule,
  UserModule,
  DiscountModule,
  FlightModule,
  FlightLegModule,
} from './modules'
import { BackendAPI } from '../services'
import { environment } from '../environments'
import { AuthPublicApiClientModule, AuthPublicApiClientModuleConfig } from '@island.is/clients/auth-public-api'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/air-discount-scheme/api.graphql'
  const auth_config = {baseApiUrl: process.env.AUTH_PUBLIC_API_URL ?? 'http://localhost:4242',} as AuthPublicApiClientModuleConfig

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
    AuthModule,
    UserModule,
    DiscountModule,
    FlightModule,
    FlightLegModule,
    CmsModule,
    AuthPublicApiClientModule.register(
      auth_config
    )
  ],
  providers: [BackendAPI],
})
export class AppModule {}
