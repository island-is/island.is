import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { TemplateService } from './template/template.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Application]),
  ],
  providers: [ApplicationService, TemplateService],
  exports: [ApplicationService, TemplateService],
})
export class ApplicationApiCoreModule {}
