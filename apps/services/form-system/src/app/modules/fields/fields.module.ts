import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { Screen } from '../screens/models/screen.model'
import { Section } from '../sections/models/section.model'
import { FieldsController } from './fields.controller'
import { FieldsService } from './fields.service'
import { Field } from './models/field.model'

@Module({
  imports: [SequelizeModule.forFeature([Field, Section, Screen, Form])],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService],
})
export class FieldsModule {}
