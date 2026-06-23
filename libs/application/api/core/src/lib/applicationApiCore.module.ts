import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateIntrospectionService } from './translation/template-introspection.service'
import { ScheduledNotification } from './scheduledNotification/scheduledNotifications.model'

@Module({
  imports: [SequelizeModule.forFeature([Application, ScheduledNotification])],
  providers: [
    ApplicationService,
    TemplateIntrospectionService,
  ],
  exports: [
    ApplicationService,
    TemplateIntrospectionService,
  ],
})
export class ApplicationApiCoreModule {}
