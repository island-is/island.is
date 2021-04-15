import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { IcelandicNameModule } from './modules/icelandic-name/icelandic-name.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

import { environment } from '../environments'
@Module({
  imports: [
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    IcelandicNameModule,
  ],
})
export class AppModule {}
