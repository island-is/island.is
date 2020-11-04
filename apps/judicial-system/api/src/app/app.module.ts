import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { environment } from '../environments'
import { BackendAPI } from '../services'
import { AuthModule, UserModule, CaseModule } from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = debug ? 'apps/judicial-system/api.graphql' : true

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
    CaseModule,
  ],
  providers: [BackendAPI],
})
export class AppModule {}
