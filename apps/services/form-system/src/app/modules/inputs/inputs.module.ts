import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { InputSettingsService } from '../inputSettings/inputSettings.service'
import { InputSettingsMapper } from '../inputSettings/models/inputSettings.mapper'
import { InputSettings } from '../inputSettings/models/inputSettings.model'
import { InputsController } from './inputs.controller'
import { InputsService } from './inputs.service'
import { InputMapper } from './models/input.mapper'
import { Input } from './models/input.model'
import { InputType } from './models/inputType.model'

@Module({
  imports: [SequelizeModule.forFeature([Input, InputType, InputSettings])],
  controllers: [InputsController],
  providers: [
    InputsService,
    InputSettingsService,
    InputMapper,
    InputSettingsMapper,
  ],
})
export class InputsModule {}
