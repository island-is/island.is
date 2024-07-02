import { Injectable, NotFoundException } from '@nestjs/common'
import { InputSettings } from './models/inputSettings.model'
import { UpdateInputSettingsDto } from './models/dto/updateInputSettings.dto'
import { InjectModel } from '@nestjs/sequelize'
import { InputSettingsMapper } from './models/inputSettings.mapper'
import { InputSettingsDto } from './models/dto/inputSettings.dto'

@Injectable()
export class InputSettingsService {
  constructor(
    @InjectModel(InputSettings)
    private readonly inputSettingsModel: typeof InputSettings,
    private readonly inputSettingsMapper: InputSettingsMapper,
  ) {}

  async create(inputId: string): Promise<InputSettingsDto> {
    await this.inputSettingsModel.create({
      inputId: inputId,
    } as InputSettings)

    return new InputSettingsDto()
  }

  async findByInputId(inputId: string): Promise<InputSettings> {
    const inputSettings = await this.inputSettingsModel.findOne({
      where: { inputId: inputId },
    })

    if (!inputSettings) {
      throw new NotFoundException(
        `inputSettings for input with id '${inputId}' not found`,
      )
    }

    return inputSettings
  }

  async findOne(inputId: string, inputType: string): Promise<InputSettingsDto> {
    const inputSettings = await this.findByInputId(inputId)

    return this.inputSettingsMapper.mapInputTypeToInputSettings(
      inputSettings,
      inputType,
    )
  }

  async update(
    id: string,
    updateInputSettings: UpdateInputSettingsDto,
  ): Promise<void> {
    const inputSettings = await this.findByInputId(id)

    this.inputSettingsMapper.mapUpdateInputSettingsDtoToInputSettings(
      inputSettings,
      updateInputSettings,
    )

    await inputSettings.save()
  }
}
