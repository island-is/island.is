import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { ListItemMapper } from '../listItems/models/listItem.mapper'

@Module({
  imports: [SequelizeModule.forFeature([Application, Form])],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationMapper,
    FieldSettingsMapper,
    ListItemMapper,
  ],
})
export class ApplicationsModule {}
