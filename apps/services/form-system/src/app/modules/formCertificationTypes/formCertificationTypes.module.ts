import { Module } from '@nestjs/common'
import { FormCertificationTypesController } from './formCertificationTypes.controller'
import { FormCertificationTypesService } from './formCertificationTypes.service'
import { FormCertificationType } from './models/formCertificationType.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'

@Module({
  imports: [SequelizeModule.forFeature([FormCertificationType, Form])],
  controllers: [FormCertificationTypesController],
  providers: [FormCertificationTypesService],
})
export class FormCertificationTypesModule {}
