import { Module } from '@nestjs/common'
import { FormCertificationTypesController } from './formCertificationTypes.controller'
import { FormCertificationTypesService } from './formCertificationTypes.service'
import { FormCertificationType } from './models/formCertificationType.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([FormCertificationType])],
  controllers: [FormCertificationTypesController],
  providers: [FormCertificationTypesService],
})
export class FormCertificationTypesModule {}
