import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateFieldDto } from './models/dto/createField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { Field } from './models/field.model'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
  ) {}

  async findById(id: string): Promise<Field> {
    const field = await this.fieldModel.findByPk(id)

    if (!field) {
      throw new NotFoundException(`Field with id '${id}' not found`)
    }

    return field
  }

  async create(createFieldDto: CreateFieldDto): Promise<FieldDto> {
    const { screenId, fieldType, displayOrder } = createFieldDto
    const newField: Field = await this.fieldModel.create({
      screenId: screenId,
      fieldType: fieldType,
      displayOrder: displayOrder,
      fieldSettings: FieldSettingsFactory.getClass(
        fieldType,
        new FieldSettings(),
      ),
    } as Field)

    const keys = [
      'id',
      'screenId',
      'name',
      'displayOrder',
      'description',
      'isPartOfMultiset',
      'isRequired',
      'fieldType',
      'fieldSettings',
    ]
    const fieldDto: FieldDto = defaults(
      pick(newField, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FieldDto

    return fieldDto
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<void> {
    const field = await this.findById(id)

    Object.assign(field, updateFieldDto)

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
