import { AuthModule } from '@island.is/auth-nest-tools'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'
import { OpenFirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import {
  AdrDigitalLicenseClientConfig,
  DisabilityDigitalLicenseClientConfig,
  FirearmDigitalLicenseClientConfig,
  MachineDigitalLicenseClientConfig,
  DrivingDigitalLicenseClientConfig,
  HuntingDigitalLicenseClientConfig,
} from '@island.is/clients/license-client'

import { LoggingModule } from '@island.is/logging'

import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'
import { LicenseConfig } from '@island.is/services/license'
import { Module } from '@nestjs/common'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    ProblemModule,
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        DrivingLicenseApiConfig,
        OpenFirearmLicenseClientConfig,
        FirearmDigitalLicenseClientConfig,
        DisabilityDigitalLicenseClientConfig,
        DrivingDigitalLicenseClientConfig,
        AdrDigitalLicenseClientConfig,
        MachineDigitalLicenseClientConfig,
        HuntingDigitalLicenseClientConfig,
        LicenseConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
