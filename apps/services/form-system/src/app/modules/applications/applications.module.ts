import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
