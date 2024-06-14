import { Module } from '@nestjs/common'
import { InputsController } from './inputs.controller'
import { InputsService } from './inputs.service'
import { Input } from './models/input.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { InputType } from './models/inputType.model'
import { InputSettings } from './models/inputSettings.model'

@Module({
  imports: [SequelizeModule.forFeature([Input, InputType, InputSettings])],
  controllers: [InputsController],
  providers: [InputsService],
})
export class InputsModule {}
