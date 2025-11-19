import { Module } from '@nestjs/common'
import { FormApplicantTypesController } from './formApplicantTypes.controller'
import { FormApplicantTypesService } from './formApplicantTypes.service'
import { Form } from '../forms/models/form.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'

@Module({
  imports: [SequelizeModule.forFeature([Form, Screen, Field])],
  controllers: [FormApplicantTypesController],
  providers: [FormApplicantTypesService],
})
export class FormApplicantTypesModule {}
