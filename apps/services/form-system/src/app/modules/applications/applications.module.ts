import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from '../values/models/value.model'
import { Organization } from '../organizations/models/organization.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Application, Form, Value, Organization]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationMapper],
})
export class ApplicationsModule {}
