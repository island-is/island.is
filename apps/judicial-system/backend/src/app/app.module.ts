import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'

import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../environments'
import {
  CaseModule,
  CourtModule,
  FileModule,
  InstitutionModule,
  NotificationModule,
  UserModule,
  EventModule,
  PoliceModule,
  AwsS3Module,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AllExceptionsFilter } from './filters'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    UserModule,
    CaseModule,
    NotificationModule,
    InstitutionModule,
    FileModule,
    CourtModule,
    EventModule,
    PoliceModule,
    AwsS3Module,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
