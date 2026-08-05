import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { ScheduledNotification } from './scheduledNotification/scheduledNotifications.model'

@Module({
  imports: [SequelizeModule.forFeature([Application, ScheduledNotification])],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationApiCoreModule {}
