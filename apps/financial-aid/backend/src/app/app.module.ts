import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { environment } from '../environments'
import { ApplicationModule } from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationModule,
  ],
})
export class AppModule {}
