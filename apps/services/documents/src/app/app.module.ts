import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditConfig, AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { DocumentProviderModule } from './modules/document-provider/document-provider.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuditModule,
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DocumentProviderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuditConfig],
    }),
  ],
})
export class AppModule {}
