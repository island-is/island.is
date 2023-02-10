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
import {
  DisabilityLicenseApiClientConfig,
  FirearmLicenseApiClientConfig,
} from './modules/license'
import { ProblemModule } from '@island.is/nest/problem'
import { FirearmLicenseClientConfig } from '@island.is/clients/firearm-license'
import { DisabilityLicenseClientConfig } from '@island.is/clients/disability-license'

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
        DisabilityLicenseClientConfig,
        FirearmLicenseApiClientConfig,
        DisabilityLicenseApiClientConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
