import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FieldSettings } from './models/fieldSettings.model'
import { FieldSettingsService } from './fieldSettings.service'
import { FieldSettingsMapper } from './models/fieldSettings.mapper'
import { ListItemMapper } from '../listItems/models/listItem.mapper'
import { ListItem } from '../listItems/models/listItem.model'

@Module({
  imports: [SequelizeModule.forFeature([FieldSettings, ListItem])],
  providers: [FieldSettingsService, FieldSettingsMapper, ListItemMapper],
  exports: [FieldSettingsService],
})
export class FieldSettingsModule {}
