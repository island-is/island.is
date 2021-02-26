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
import {
  AuthModule,
  UserModule,
  CaseModule,
  FileModule,
  AuditModule,
  InstitutionModule,
  CourtModule,
} from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/judicial-system/api.graphql'

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
    AuditModule,
    UserModule,
    CaseModule,
    FileModule,
    InstitutionModule,
    CourtModule,
  ],
  providers: [BackendAPI],
})
export class AppModule {}
