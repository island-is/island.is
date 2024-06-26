import { SequelizeModule } from '@nestjs/sequelize'
import { ListItem } from './models/listItem.model'
import { ListItemsService } from './listItems.service'
import { Module } from '@nestjs/common'
import { InputSettingsService } from '../inputSettings/inputSettings.service'
import { InputSettings } from '../inputSettings/models/inputSettings.model'
import { InputSettingsMapper } from '../inputSettings/models/inputSettings.mapper'
import { ListItemsController } from './listItems.controller'
import { ListItemMapper } from './models/listItem.mapper'

@Module({
  imports: [SequelizeModule.forFeature([ListItem, InputSettings])],
  controllers: [ListItemsController],
  providers: [
    ListItemsService,
    InputSettingsService,
    InputSettingsMapper,
    ListItemMapper,
  ],
  exports: [ListItemsService, ListItemMapper],
})
export class ListItemsModule {}
