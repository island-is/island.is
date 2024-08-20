import { Injectable, NotFoundException } from '@nestjs/common'
import { FieldSettings } from './models/fieldSettings.model'
import { UpdateFieldSettingsDto } from './models/dto/updateFieldSettings.dto'
import { InjectModel } from '@nestjs/sequelize'
import { FieldSettingsMapper } from './models/fieldSettings.mapper'
import { FieldSettingsDto } from './models/dto/fieldSettings.dto'
import { ListItem } from '../listItems/models/listItem.model'

@Injectable()
export class FieldSettingsService {
  constructor(
    @InjectModel(FieldSettings)
    private readonly fieldSettingsModel: typeof FieldSettings,
    private readonly fieldSettingsMapper: FieldSettingsMapper,
  ) {}

  async create(fieldId: string): Promise<FieldSettingsDto> {
    await this.fieldSettingsModel.create({
      fieldId: fieldId,
    } as FieldSettings)

    return new FieldSettingsDto()
  }

  async findByFieldId(fieldId: string): Promise<FieldSettings> {
    const fieldSettings = await this.fieldSettingsModel.findOne({
      where: { fieldId: fieldId },
      include: [{ model: ListItem, as: 'list' }],
    })

    if (!fieldSettings) {
      throw new NotFoundException(
        `fieldSettings for field with id '${fieldId}' not found`,
      )
    }

    return fieldSettings
  }

  async findOne(fieldId: string, fieldType: string): Promise<FieldSettingsDto> {
    const fieldSettings = await this.findByFieldId(fieldId)

    const fieldSettingsDto =
      this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
        fieldSettings,
        fieldType,
      )

    return fieldSettingsDto
  }

  async update(
    id: string,
    updateFieldSettings: UpdateFieldSettingsDto,
  ): Promise<void> {
    const fieldSettings = await this.findByFieldId(id)

    this.fieldSettingsMapper.mapUpdateFieldSettingsDtoToFieldSettings(
      fieldSettings,
      updateFieldSettings,
    )

    await fieldSettings.save()
  }
}
