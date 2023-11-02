import { Module } from '@nestjs/common'

import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { OpenFirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { ProblemModule } from '@island.is/nest/problem'
import {
  AdrDigitalLicenseClientConfig,
  DisabilityDigitalLicenseClientConfig,
  FirearmDigitalLicenseClientConfig,
  MachineDigitalLicenseClientConfig,
  DrivingDigitalLicenseClientConfig,
} from '@island.is/clients/license-client'
import { AuthModule } from '@island.is/auth-nest-tools'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'

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
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
