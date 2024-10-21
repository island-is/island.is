import { Module } from '@nestjs/common'
import { FormCertificationsController } from './formCertifications.controller'
import { FormCertificationsService } from './formCertifications.service'
import { FormCertification } from './models/formCertification.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([FormCertification])],
  controllers: [FormCertificationsController],
  providers: [FormCertificationsService],
})
export class FormCertificationsModule {}
