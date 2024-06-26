import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { InputSettings } from './models/inputSettings.model'
import { InputSettingsService } from './inputSettings.service'
import { InputSettingsMapper } from './models/inputSettings.mapper'
import { ListItemMapper } from '../listItems/models/listItem.mapper'
import { ListItem } from '../listItems/models/listItem.model'

@Module({
  imports: [SequelizeModule.forFeature([InputSettings, ListItem])],
  providers: [InputSettingsService, InputSettingsMapper, ListItemMapper],
  exports: [InputSettingsService],
})
export class InputSettingsModule {}
