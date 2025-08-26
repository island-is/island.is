import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FieldsController } from './fields.controller'
import { FieldsService } from './fields.service'
import { Field } from './models/field.model'
import { Section } from '../sections/models/section.model'
import { Screen } from '../screens/models/screen.model'
import { Form } from '../forms/models/form.model'

@Module({
  imports: [SequelizeModule.forFeature([Field, Section, Screen, Form])],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
