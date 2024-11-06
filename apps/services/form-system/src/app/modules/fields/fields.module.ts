import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
// import { FieldSettingsService } from '../fieldSettings/fieldSettings.service'
// import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
// import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { FieldsController } from './fields.controller'
import { FieldsService } from './fields.service'
import { FieldMapper } from './models/field.mapper'
import { Field } from './models/field.model'
// import { FieldType } from './models/fieldType.model'
import { ListItemMapper } from '../listItems/models/listItem.mapper'

@Module({
  imports: [SequelizeModule.forFeature([Field])],
  controllers: [FieldsController],
  providers: [
    FieldsService,
    // FieldSettingsService,
    FieldMapper,
    // FieldSettingsMapper,
    ListItemMapper,
  ],
})
export class FieldsModule {}
