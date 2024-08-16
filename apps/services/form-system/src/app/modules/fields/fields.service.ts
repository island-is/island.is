import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FieldSettingsService } from '../fieldSettings/fieldSettings.service'
import { CreateFieldDto } from './models/dto/createField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { FieldMapper } from './models/field.mapper'
import { Field } from './models/field.model'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    private readonly fieldSettingsService: FieldSettingsService,
    private readonly fieldMapper: FieldMapper,
  ) {}

  async findOne(id: string): Promise<FieldDto> {
    const field = await this.findById(id)
    const fieldSettingsDto = await this.fieldSettingsService.findOne(
      id,
      field.fieldType,
    )

    const fieldDto: FieldDto = this.fieldMapper.mapFieldToFieldDto(
      field,
      fieldSettingsDto,
    )

    return fieldDto
  }

  async findById(id: string): Promise<Field> {
    const field = await this.fieldModel.findByPk(id)

    if (!field) {
      throw new NotFoundException(`Field with id '${id}' not found`)
    }

    return field
  }

  async create(createFieldDto: CreateFieldDto): Promise<FieldDto> {
    const { screenId } = createFieldDto

    const newField: Field = await this.fieldModel.create({
      screenId: screenId,
    } as Field)

    const newFieldSettingsDto = await this.fieldSettingsService.create(
      newField.id,
    )

    const fieldDto: FieldDto = this.fieldMapper.mapFieldToFieldDto(
      newField,
      newFieldSettingsDto,
    )

    return fieldDto
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<void> {
    const field = await this.findById(id)

    this.fieldMapper.mapUpdateFieldDtoToField(field, updateFieldDto)

    if (updateFieldDto.fieldSettings) {
      await this.fieldSettingsService.update(id, updateFieldDto.fieldSettings)
    }

    await field.save()
  }

  async updateDisplayOrder(
    updateFieldsDisplayOrderDto: UpdateFieldsDisplayOrderDto,
  ): Promise<void> {
    const { fieldsDisplayOrderDto } = updateFieldsDisplayOrderDto

    for (let i = 0; i < fieldsDisplayOrderDto.length; i++) {
      const field = await this.fieldModel.findByPk(fieldsDisplayOrderDto[i].id)

      if (!field) {
        throw new NotFoundException(
          `Field with id '${fieldsDisplayOrderDto[i].id}' not found`,
        )
      }

      await field.update({
        displayOrder: i,
        screenId: fieldsDisplayOrderDto[i].screenId,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const field = await this.findById(id)
    field?.destroy()
  }
}
