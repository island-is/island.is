import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ProblemModule } from '@island.is/nest/problem'
import { ConfigModule } from '@island.is/nest/config'
import { courtClientModuleConfig } from '@island.is/judicial-system/court-client'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../environments'
import {
  CaseModule,
  DefendantModule,
  UserModule,
  InstitutionModule,
  FileModule,
  NotificationModule,
  PoliceModule,
  CourtModule,
  AwsS3Module,
  EventModule,
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
    UserModule,
    InstitutionModule,
    FileModule,
    NotificationModule,
    PoliceModule,
    CourtModule,
    AwsS3Module,
    EventModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [courtClientModuleConfig],
    }),
  ],
})
export class AppModule {}
