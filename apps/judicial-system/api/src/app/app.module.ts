import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { logger } from '@island.is/logging'

// Must import this before the shared auth module in local development
import { environment } from '../environments'
// Log the environment in local development
!environment.production &&
  logger.debug(JSON.stringify({ environment }, null, 4))

import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { BackendAPI } from '../services'
import { AuthModule, UserModule, CaseModule, FileModule } from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = debug ? 'apps/judicial-system/api.graphql' : true

/*
 * When adding new resolvers through your modules don't forget to add them to buildSchema.ts as well.
 * So the automatically generated schemas won't be failing when running.
 */
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
    SharedAuthModule,
    AuditTrailModule,
    AuthModule,
    UserModule,
    CaseModule,
    FileModule,
  ],
  providers: [BackendAPI],
})
export class AppModule {}
