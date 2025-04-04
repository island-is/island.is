import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { IcelandicNameModule } from './modules/icelandic-name/icelandic-name.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

import { environment } from '../environments'
import { ConfigModule } from '@nestjs/config'
@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    IcelandicNameModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AuditConfig
      ]
    })
  ],
})
export class AppModule {}
