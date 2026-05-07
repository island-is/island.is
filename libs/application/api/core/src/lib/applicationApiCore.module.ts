import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateIntrospectionService } from './translation/template-introspection.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
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
