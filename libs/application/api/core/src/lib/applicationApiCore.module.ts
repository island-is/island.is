import { Module, Scope } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateService } from './template/template.service'
import { ContextService } from './context/context.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  providers: [
    ApplicationService,
    TemplateService,
    {
      provide: ContextService,
      useClass: ContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [ApplicationService, TemplateService, ContextService],
})
export class ApplicationApiCoreModule {}
