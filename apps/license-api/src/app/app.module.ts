import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'
import { LoggingModule } from '@island.is/logging'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'
import {
  AdrLicenseClientApiConfig,
  DisabilityLicenseClientApiConfig,
  FirearmLicenseClientApiConfig,
  MachineLicenseClientApiConfig,
  DrivingLicenseClientApiConfig,
} from '@island.is/clients/license-client'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'
import { AdrAndMachineLicenseClientConfig } from '@island.is/clients/adr-and-machine-license'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    ProblemModule,
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        IdsClientConfig,
        AdrAndMachineLicenseClientConfig,
        AdrLicenseClientApiConfig,
        MachineLicenseClientApiConfig,
        DisabilityLicenseClientConfig,
        DisabilityLicenseClientApiConfig,
        FirearmLicenseClientConfig,
        FirearmLicenseClientApiConfig,
        DrivingLicenseClientApiConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
