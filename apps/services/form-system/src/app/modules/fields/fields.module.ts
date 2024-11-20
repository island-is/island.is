import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FieldsController } from './fields.controller'
import { FieldsService } from './fields.service'
import { FieldMapper } from './models/field.mapper'
import { Field } from './models/field.model'
// import { ListItemMapper } from '../listItems/models/listItem.mapper'

@Module({
  imports: [SequelizeModule.forFeature([Field])],
  controllers: [FieldsController],
  providers: [FieldsService, FieldMapper],
})
export class FieldsModule {}
