import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { InputSettings } from './models/inputSettings.model'
import { InputSettingsService } from './inputSettings.service'
import { InputSettingsMapper } from './models/inputSettings.mapper'

@Module({
  imports: [SequelizeModule.forFeature([InputSettings])],
  providers: [InputSettingsService, InputSettingsMapper],
  exports: [InputSettingsService],
})
export class InputSettingsModule {}
