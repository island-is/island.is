import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { DocumentProviderModule } from './modules/document-provider/document-provider.module'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DocumentProviderModule,
  ],
})
export class AppModule {}
