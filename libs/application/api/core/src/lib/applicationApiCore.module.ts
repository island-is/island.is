import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { TemplateService } from './template/template.service'

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  providers: [ApplicationService, TemplateService],
  exports: [ApplicationService, TemplateService],
})
export class ApplicationApiCoreModule {}
