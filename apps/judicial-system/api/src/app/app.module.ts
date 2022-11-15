import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { ProblemModule } from '@island.is/nest/problem'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

import { environment } from '../environments'
import { BackendApi } from './data-sources/backend'
import {
  AuthModule,
  UserModule,
  CaseModule,
  FileModule,
  InstitutionModule,
  FeatureModule,
  PoliceModule,
  DefendantModule,
  fileModuleConfig,
} from './modules'
import { ConfigModule } from '@nestjs/config'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/judicial-system/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }: never) => ({ req }),
      dataSources: () => ({ backendApi: new BackendApi() }),
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    AuditTrailModule.register(environment.auditTrail),
    AuthModule,
    UserModule,
    CaseModule,
    DefendantModule,
    FileModule,
    InstitutionModule,
    FeatureModule,
    CmsTranslationsModule,
    PoliceModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({ isGlobal: true, load: [fileModuleConfig] }),
  ],
})
export class AppModule {}
