import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'

import { IcelandicNameModule } from './modules/icelandic-name/icelandic-name.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    IcelandicNameModule,
  ],
})
export class AppModule {}
