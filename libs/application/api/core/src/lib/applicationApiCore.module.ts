import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationApiCoreModule {}
