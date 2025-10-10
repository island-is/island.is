import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule } from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

import { environment } from '../environments'
import { DocumentProviderModule } from './modules/document-provider/document-provider.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FeatureFlagConfig],
    }),
    DocumentProviderModule,
  ],
})
export class AppModule {}
