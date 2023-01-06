import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from './modules/license'
import { DisabilityLicenseClientConfig } from './modules/license/clients/disabilityLicense/disabilityLicenseClient.config'
import { ProblemModule } from '@island.is/nest/problem'

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
        FirearmLicenseClientConfig,
        DisabilityLicenseClientConfig,
      ],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
