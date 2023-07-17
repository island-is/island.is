import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ProblemModule } from '@island.is/nest/problem'
import { ConfigModule } from '@island.is/nest/config'
import { signingModuleConfig } from '@island.is/dokobit-signing'
import { courtClientModuleConfig } from '@island.is/judicial-system/court-client'
import { messageModuleConfig } from '@island.is/judicial-system/message'
import { AuthModule } from '@island.is/auth-nest-tools'

import { environment } from '../environments'
import {
  caseModuleConfig,
  notificationModuleConfig,
  CaseModule,
  DefendantModule,
  UserModule,
  InstitutionModule,
  FileModule,
  NotificationModule,
  PoliceModule,
  policeModuleConfig,
  IndictmentCountModule,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule.register(environment.identityServerAuth),
    CaseModule,
    DefendantModule,
    IndictmentCountModule,
    UserModule,
    InstitutionModule,
    FileModule,
    NotificationModule,
    PoliceModule,
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
      ],
    }),
  ],
})
export class AppModule {}
