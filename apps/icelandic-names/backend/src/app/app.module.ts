import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IcelandicNameModule } from './modules/icelandic-name/icelandic-name.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    IcelandicNameModule,
  ],
})
export class AppModule {}
