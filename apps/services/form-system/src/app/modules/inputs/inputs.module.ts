import { Module } from '@nestjs/common'
import { InputsController } from './inputs.controller'
import { InputsService } from './inputs.service'
import { Input } from './models/input.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { InputType } from './models/inputType.model'
import { InputSettings } from '../inputSettings/models/inputSettings.model'
import { InputSettingsModule } from '../inputSettings/inputSettings.module'
import { InputSettingsService } from '../inputSettings/inputSettings.service'
import { InputMapper } from './models/input.mapper'
import { InputSettingsMapper } from '../inputSettings/models/inputSettings.mapper'

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
