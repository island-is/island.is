import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { signingModuleConfig } from '@island.is/dokobit-signing'
import { ConfigModule } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { courtClientModuleConfig } from '@island.is/judicial-system/court-client'
import { messageModuleConfig } from '@island.is/judicial-system/message'

import { environment } from '../environments'
import {
  awsS3ModuleConfig,
  CaseModule,
  caseModuleConfig,
  courtModuleConfig,
  DefendantModule,
  EventLogModule,
  eventModuleConfig,
  FileModule,
  IndictmentCountModule,
  InstitutionModule,
  NotificationModule,
  notificationModuleConfig,
  PoliceModule,
  policeModuleConfig,
  UserModule,
  userModuleConfig,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    CaseModule,
    DefendantModule,
    IndictmentCountModule,
    UserModule,
    InstitutionModule,
    FileModule,
    NotificationModule,
    PoliceModule,
    EventLogModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        signingModuleConfig,
        courtClientModuleConfig,
        messageModuleConfig,
        caseModuleConfig,
        notificationModuleConfig,
        policeModuleConfig,
        userModuleConfig,
        awsS3ModuleConfig,
        eventModuleConfig,
        courtModuleConfig,
      ],
    }),
  ],
})
export class AppModule {}
