import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
})
export class AppModule {}
