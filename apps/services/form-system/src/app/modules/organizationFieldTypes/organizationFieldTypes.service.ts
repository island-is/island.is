import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { OrganizationFieldType } from './models/organizationFieldType.model'
import { CreateOrganizationFieldTypeDto } from './models/dto/createOrganizationFieldType.dto'
import { OrganizationFieldTypeDto } from './models/dto/organizationFieldType.dto'
import { FieldTypes } from '../../dataTypes/fieldTypes/fieldType.model'

@Injectable()
export class OrganizationFieldTypesService {
  constructor(
    @InjectModel(OrganizationFieldType)
    private readonly organizationFieldTypeModel: typeof OrganizationFieldType,
  ) {}

  async create(
    createOrganizationFieldTypeDto: CreateOrganizationFieldTypeDto,
  ): Promise<OrganizationFieldTypeDto> {
    const fieldType = FieldTypes.find(
      (fieldType) =>
        fieldType.id === createOrganizationFieldTypeDto.fieldTypeId,
    )

    if (!fieldType) {
      throw new NotFoundException(
        `fieldType with id '${createOrganizationFieldTypeDto.fieldTypeId}' not found`,
      )
    }

    const organizationFieldType =
      createOrganizationFieldTypeDto as OrganizationFieldType

    const newOrganizationFieldType: OrganizationFieldType =
      new this.organizationFieldTypeModel(organizationFieldType)

    await newOrganizationFieldType.save()

    const keys = ['id', 'fieldTypeId']
    const organizationFieldTypeDto: OrganizationFieldTypeDto = defaults(
      pick(newOrganizationFieldType, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationFieldTypeDto

    return organizationFieldTypeDto
  }

  async delete(id: string): Promise<void> {
    const organizationFieldType =
      await this.organizationFieldTypeModel.findByPk(id)

    if (!organizationFieldType) {
      throw new NotFoundException(
        `Organization field type with id '${id}' not found`,
      )
    }

    organizationFieldType.destroy()
  }
}
