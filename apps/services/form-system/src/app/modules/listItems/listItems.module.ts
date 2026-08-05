import { SequelizeModule } from '@nestjs/sequelize'
import { ListItem } from './models/listItem.model'
import { ListItemsService } from './listItems.service'
import { Module } from '@nestjs/common'
import { ListItemsController } from './listItems.controller'
import { Form } from '../forms/models/form.model'
import { Section } from '../sections/models/section.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'

@Module({
  imports: [
    SequelizeModule.forFeature([ListItem, Form, Section, Screen, Field]),
  ],
  controllers: [ListItemsController],
  providers: [ListItemsService],
  exports: [ListItemsService],
})
export class ListItemsModule {}
