import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { OrganizationListType } from './models/organizationListType.model'
import { CreateOrganizationListTypeDto } from './models/dto/createOrganizationListType.dto'
import { OrganizationListTypeDto } from './models/dto/organizationListType.dto'
import { ListTypes } from '../../dataTypes/listTypes/listType.model'

@Injectable()
export class OrganizationListTypesService {
  constructor(
    @InjectModel(OrganizationListType)
    private readonly organizationListTypeModel: typeof OrganizationListType,
  ) {}

  async create(
    createOrganizationListTypeDto: CreateOrganizationListTypeDto,
  ): Promise<OrganizationListTypeDto> {
    const listType = ListTypes.find(
      (listType) => listType.id === createOrganizationListTypeDto.listTypeId,
    )

    if (!listType) {
      throw new NotFoundException(
        `listType with id '${createOrganizationListTypeDto.listTypeId}' not found`,
      )
    }

    const organizationListType =
      createOrganizationListTypeDto as OrganizationListType

    const newOrganizationListType: OrganizationListType =
      new this.organizationListTypeModel(organizationListType)

    await newOrganizationListType.save()

    const keys = ['id', 'listTypeId']
    const organizationListTypeDto: OrganizationListTypeDto = defaults(
      pick(newOrganizationListType, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationListTypeDto

    return organizationListTypeDto
  }

  async delete(id: string): Promise<void> {
    const organizationListType = await this.organizationListTypeModel.findByPk(
      id,
    )

    if (!organizationListType) {
      throw new NotFoundException(
        `Organization list type with id '${id}' not found`,
      )
    }

    organizationListType.destroy()
  }
}
