import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { SharedAuthModule } from '@island.is/financial-aid/auth'
import { environment } from '../environments'
import { BackendAPI } from '../services'
import {
  AuthModule,
  UserModule,
  ApplicationModule,
  MunicipalityModule,
  FileModule,
} from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/financial-aid/api.graphql'

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
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    AuthModule,
    UserModule,
    ApplicationModule,
    MunicipalityModule,
    FileModule,
  ],
  providers: [BackendAPI],
})
export class AppModule {}
