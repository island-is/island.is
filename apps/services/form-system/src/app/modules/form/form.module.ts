import { Module } from '@nestjs/common'

import { FormController } from './form.controller'
import { FormService } from './form.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationTemplate } from './form.model'

@Module({
  imports: [SequelizeModule.forFeature([ApplicationTemplate])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
