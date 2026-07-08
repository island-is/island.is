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
import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import {
  AppealCaseModule,
  AuthModule,
  authModuleConfig,
  BackendModule,
  backendModuleConfig,
  CaseListModule,
  CaseModule,
  CaseTableModule,
  CourtSessionModule,
  DefendantModule,
  DefenderModule,
  EventLogModule,
  FeatureModule,
  featureModuleConfig,
  FileModule,
  fileModuleConfig,
  IndictmentCountModule,
  InstitutionModule,
  MessageSuspensionModule,
  PoliceModule,
  StatisticsModule,
  SubpoenaModule,
  UserModule,
  VerdictModule,
  VictimModule,
} from './modules'

const production = process.env.NODE_ENV === 'production'
const debug = !production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = production
  ? true
  : 'apps/judicial-system/api/src/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground,
      autoSchemaFile,
      cache: 'bounded',
      path: '/api/graphql',
      context: ({ req }: never) => ({ req }),
    }),
    BackendModule,
    SharedAuthModule,
    AuditTrailModule,
    AuthModule,
    UserModule,
    CaseModule,
    AppealCaseModule,
    CaseListModule,
    StatisticsModule,
    DefendantModule,
    DefenderModule,
    SubpoenaModule,
    IndictmentCountModule,
    CourtSessionModule,
    FileModule,
    InstitutionModule,
    FeatureModule,
    CmsTranslationsModule,
    PoliceModule,
    EventLogModule,
    VictimModule,
    VerdictModule,
    CaseTableModule,
    MessageSuspensionModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        sharedAuthModuleConfig,
        fileModuleConfig,
        auditTrailModuleConfig,
        featureModuleConfig,
        authModuleConfig,
        backendModuleConfig,
      ],
    }),
  ],
})
export class AppModule {}
