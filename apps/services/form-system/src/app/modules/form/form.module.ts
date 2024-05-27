import { Module } from '@nestjs/common'

import { FormController } from './form.controller'
import { FormService } from './form.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Form } from './form.model'

@Module({
  imports: [SequelizeModule.forFeature([Form])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
