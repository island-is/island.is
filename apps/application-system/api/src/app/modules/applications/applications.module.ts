import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from '../../core/db/models/application.model'
import { ApplicationsController } from './applications.controller'
import { ApplicationsService } from './applications.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationModule {}
