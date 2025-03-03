import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FieldsController } from './fields.controller'
import { FieldsService } from './fields.service'
import { Field } from './models/field.model'

@Module({
  imports: [SequelizeModule.forFeature([Field])],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
