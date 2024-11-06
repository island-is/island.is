import { SequelizeModule } from '@nestjs/sequelize'
import { ListItem } from './models/listItem.model'
import { ListItemsService } from './listItems.service'
import { Module } from '@nestjs/common'
// import { FieldSettingsService } from '../fieldSettings/fieldSettings.service'
// import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
// import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { ListItemsController } from './listItems.controller'
import { ListItemMapper } from './models/listItem.mapper'

@Module({
  imports: [SequelizeModule.forFeature([ListItem])],
  controllers: [ListItemsController],
  providers: [
    ListItemsService,
    // FieldSettingsService,
    // FieldSettingsMapper,
    ListItemMapper,
  ],
  exports: [ListItemsService, ListItemMapper],
})
export class ListItemsModule {}
