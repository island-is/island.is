import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ResourceModule } from './modules/resource/resource.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ResourceModule,
  ],
})
export class AppModule {}
