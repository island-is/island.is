import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditConfig, AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { ResourceModule } from './modules/resource/resource.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot({
      defaultNamespace: '@island.is/reference-backend',
      serviceName: 'reference-backend'
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AuditConfig
      ]
    })
  ],
})
export class AppModule {}
