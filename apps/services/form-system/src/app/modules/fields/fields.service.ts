import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
// import { FieldSettingsService } from '../fieldSettings/fieldSettings.service'
import { CreateFieldDto } from './models/dto/createField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { FieldMapper } from './models/field.mapper'
import { Field } from './models/field.model'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'
import { FieldTypesEnum } from '../../enums/fieldTypes'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { ValueDto } from '../values/models/dto/value.dto'
import { randomUUID } from 'crypto'

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    // private readonly fieldSettingsService: FieldSettingsService,
    private readonly fieldMapper: FieldMapper,
  ) {}

  async findById(id: string): Promise<Field> {
    const field = await this.fieldModel.findByPk(id)

    if (!field) {
      throw new NotFoundException(`Field with id '${id}' not found`)
    }

    return field
  }

  async create(createFieldDto: CreateFieldDto): Promise<FieldDto> {
    const { screenId, fieldType } = createFieldDto
    const newField: Field = await this.fieldModel.create({
      screenId: screenId,
      fieldType: fieldType,
      fieldSettings: FieldSettingsFactory.getClass(
        fieldType,
        new FieldSettings(),
      ),
    } as Field)

    // const newFieldSettingsDto = await this.fieldSettingsService.create(
    //   newField.id,
    // )

    const fieldDto: FieldDto = this.fieldMapper.mapFieldToFieldDto(
      newField,
      // newFieldSettingsDto,
    )

    // fieldDto.fieldSettingsType = FieldSettingsTypeFactory.getClass(
    //   fieldType,
    //   new FieldSettingsType(),
    // )

    fieldDto.values = [
      {
        id: randomUUID(),
        order: 0,
        json: ValueTypeFactory.getClass(fieldType, new ValueType()),
      },
    ]

    return fieldDto
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<void> {
    const field = await this.findById(id)

    this.fieldMapper.mapUpdateFieldDtoToField(field, updateFieldDto)

    // if (updateFieldDto.fieldSettings) {
    //   await this.fieldSettingsService.update(id, updateFieldDto.fieldSettings)
    // }

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
