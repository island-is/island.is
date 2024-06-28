import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { FormsService } from '../forms/forms.service'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'

@Module({
  imports: [SequelizeModule.forFeature([Application, Form])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationMapper],
})
export class ApplicationsModule {}
