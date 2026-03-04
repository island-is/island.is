import { MiddlewareConsumer, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { signingModuleConfig } from '@island.is/dokobit-signing'
import { emailModuleConfig } from '@island.is/email-service'
import { ConfigModule } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'
import { smsModuleConfig } from '@island.is/nova-sms'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { courtClientModuleConfig } from '@island.is/judicial-system/court-client'
import {
  MessageMiddleware,
  MessageModule,
  messageModuleConfig,
} from '@island.is/judicial-system/message'

import { CaseContextMiddleware, RequestContextMiddleware } from './middleware'
import {
  awsS3ModuleConfig,
  CaseModule,
  caseModuleConfig,
  CaseTableModule,
  courtModuleConfig,
  CourtSessionModule,
  CriminalRecordModule,
  criminalRecordModuleConfig,
  DefendantModule,
  EventLogModule,
  eventModuleConfig,
  FileModule,
  fileModuleConfig,
  IndictmentCountModule,
  InstitutionModule,
  lawyerRegistryConfig,
  LawyerRegistryModule,
  NotificationModule,
  notificationModuleConfig,
  PoliceModule,
  policeModuleConfig,
  RepositoryModule,
  StatisticsModule,
  SubpoenaModule,
  UserModule,
  userModuleConfig,
  VerdictModule,
  VictimModule,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule,
    CaseModule,
    CourtSessionModule,
    DefendantModule,
    IndictmentCountModule,
    UserModule,
    InstitutionModule,
    FileModule,
    CriminalRecordModule,
    NotificationModule,
    PoliceModule,
    EventLogModule,
    SubpoenaModule,
    VerdictModule,
    VictimModule,
    CaseTableModule,
    LawyerRegistryModule,
    StatisticsModule,
    RepositoryModule,
    MessageModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        sharedAuthModuleConfig,
        signingModuleConfig,
        smsModuleConfig,
        emailModuleConfig,
        courtClientModuleConfig,
        messageModuleConfig,
        caseModuleConfig,
        fileModuleConfig,
        notificationModuleConfig,
        lawyerRegistryConfig,
        policeModuleConfig,
        userModuleConfig,
        awsS3ModuleConfig,
        eventModuleConfig,
        courtModuleConfig,
        criminalRecordModuleConfig,
      ],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*')
    consumer
      .apply(CaseContextMiddleware)
      .forRoutes(
        '/api/case/:caseId',
        '/api/internal/case/:caseId',
        '/api/internal/case/indictment/:caseId',
      )
    consumer.apply(MessageMiddleware).forRoutes('*')
  }
}
