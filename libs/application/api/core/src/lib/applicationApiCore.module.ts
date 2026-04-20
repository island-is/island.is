import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateIntrospectionService } from './translation/template-introspection.service'
import { AiTranslateService } from './translation/ai-translate.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  providers: [
    ApplicationService,
    TemplateIntrospectionService,
    AiTranslateService,
  ],
  exports: [
    ApplicationService,
    TemplateIntrospectionService,
    AiTranslateService,
  ],
})
export class ApplicationApiCoreModule {}
