import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
  DisabilityLicenseApiClientConfig,
  FirearmLicenseApiClientConfig,
} from './modules/license'
import { OpenFirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { ProblemModule } from '@island.is/nest/problem'
import { DrivingLicenseApiClientConfig } from './modules/license/clients/drivingLicense/drivingLicenseApiClient.config'
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
        FirearmLicenseApiClientConfig,
        DisabilityLicenseApiClientConfig,
        DrivingLicenseApiClientConfig,
        OpenFirearmLicenseClientConfig,
        DrivingLicenseApiConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
