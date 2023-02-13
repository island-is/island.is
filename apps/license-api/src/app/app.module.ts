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
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'
import {
  FirearmDigitalLicenseConfig,
  DisabilityDigitalLicenseConfig,
  AdrDigitalLicenseConfig,
  MachineDigitalLicenseConfig,
  DrivingDigitalLicenseConfig,
} from '@island.is/clients/license-client'
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
        FirearmLicenseClientConfig,
        FirearmDigitalLicenseConfig,
        DisabilityDigitalLicenseConfig,
        DisabilityLicenseClientConfig,
        AdrAndMachineLicenseClientConfig,
        AdrDigitalLicenseConfig,
        MachineDigitalLicenseConfig,
        DrivingDigitalLicenseConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
