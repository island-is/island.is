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
  AuthModule,
  authModuleConfig,
  BackendModule,
  backendModuleConfig,
  BackendService,
  CaseListModule,
  CaseModule,
  CaseTableModule,
  DefendantModule,
  DefenderModule,
  EventLogModule,
  FeatureModule,
  featureModuleConfig,
  FileModule,
  fileModuleConfig,
  IndictmentCountModule,
  InstitutionModule,
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
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [BackendModule],
      useFactory: (backendService: BackendService) => ({
        debug,
        playground,
        autoSchemaFile,
        cache: 'bounded',
        path: '/api/graphql',
        context: ({ req }: never) => ({ req }),
        dataSources: () => ({ backendService }),
      }),
      inject: [BackendService],
    }),
    SharedAuthModule,
    AuditTrailModule,
    AuthModule,
    UserModule,
    CaseModule,
    CaseListModule,
    StatisticsModule,
    DefendantModule,
    DefenderModule,
    SubpoenaModule,
    IndictmentCountModule,
    FileModule,
    InstitutionModule,
    FeatureModule,
    CmsTranslationsModule,
    PoliceModule,
    EventLogModule,
    VictimModule,
    VerdictModule,
    CaseTableModule,
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
