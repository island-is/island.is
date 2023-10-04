import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../environments'
import { BackendApi } from './data-sources/backend'
import { CaseListModule } from './modules/caseList/caseList.module'
import {
  AuthModule,
  authModuleConfig,
  CaseModule,
  DefendantModule,
  FeatureModule,
  featureModuleConfig,
  FileModule,
  fileModuleConfig,
  IndictmentCountModule,
  InstitutionModule,
  PoliceModule,
  UserModule,
} from './modules'

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
      cache: 'bounded',
      path: '/api/graphql',
      context: ({ req }: never) => ({ req }),
      dataSources: () => ({ backendApi: new BackendApi() }),
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    AuditTrailModule,
    AuthModule,
    UserModule,
    CaseModule,
    CaseListModule,
    DefendantModule,
    IndictmentCountModule,
    FileModule,
    InstitutionModule,
    FeatureModule,
    CmsTranslationsModule,
    PoliceModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        fileModuleConfig,
        auditTrailModuleConfig,
        featureModuleConfig,
        authModuleConfig,
      ],
    }),
  ],
})
export class AppModule {}
