import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
// import { ListItemMapper } from '../listItems/models/listItem.mapper'
import { Value } from '../values/models/value.model'
import { FormsService } from '../forms/forms.service'

@Module({
  imports: [SequelizeModule.forFeature([Application, Form, Value])],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationMapper,
    // FormsService,
  ],
})
export class ApplicationsModule {}
