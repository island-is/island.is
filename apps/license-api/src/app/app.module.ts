import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { LicenseModule } from './modules/license/license.module'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from './modules/license'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, FirearmLicenseClientConfig],
    }),
    LicenseModule,
  ],
})
export class AppModule {}
