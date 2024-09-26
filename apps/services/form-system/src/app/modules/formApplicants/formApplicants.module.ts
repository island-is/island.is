import { Module } from '@nestjs/common'
import { FormApplicantsController } from './formApplicants.controller'
import { FormApplicantsService } from './formApplicants.service'
import { FormApplicant } from './models/formApplicant.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([FormApplicant])],
  controllers: [FormApplicantsController],
  providers: [FormApplicantsService],
})
export class FormApplicantsModule {}
