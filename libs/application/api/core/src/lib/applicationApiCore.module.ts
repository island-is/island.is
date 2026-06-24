import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateIntrospectionService } from './translation/template-introspection.service'
import { TranslationAccessService } from './translation/translation-access.service'
import { ScheduledNotification } from './scheduledNotification/scheduledNotifications.model'

@Module({
  imports: [SequelizeModule.forFeature([Application, ScheduledNotification])],
  providers: [
    ApplicationService,
    TemplateIntrospectionService,
    TranslationAccessService,
  ],
  exports: [
    ApplicationService,
    TemplateIntrospectionService,
    TranslationAccessService,
  ],
})
export class ApplicationApiCoreModule {}
