import { AuthModule as BaseAuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { environment } from '../environment'
import { UserModule } from './modules/user/user.module'
import { AuthModule as ApplicationAuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    BaseAuthModule.register(environment.auth),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, FeatureFlagConfig, IdsClientConfig],
    }),
    UserModule,
    ApplicationAuthModule,
  ],
})
export class AppModule {}
