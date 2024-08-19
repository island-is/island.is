import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { Organization } from './models/organization.model'
import { OrganizationsResponseDto } from './models/dto/organizations.response.dto'
import { OrganizationDto } from './models/dto/organization.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { FormDto } from '../forms/models/dto/form.dto'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
  ) {}

  async findAll(): Promise<OrganizationsResponseDto> {
    const organizations = await this.organizationModel.findAll()

    const organizationsDto: OrganizationDto[] = []

    const keys = ['id', 'name', 'nationalId']
    organizations.map((organization) => {
      organizationsDto.push(
        defaults(
          pick(organization, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as OrganizationDto,
      )
    })

    const organizationsResponse: OrganizationsResponseDto =
      new OrganizationsResponseDto()
    organizationsResponse.organizations = organizationsDto

    return organizationsResponse
  }

  async findOne(id: string): Promise<OrganizationDto> {
    const organization = await this.organizationModel.findByPk(id, {
      include: [Form],
    })

    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`)
    }

    const keys = ['id', 'name', 'nationalId']
    const organizationDto: OrganizationDto = defaults(
      pick(organization, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationDto

    const formKeys = [
      'id',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
    ]

    organizationDto.forms = organization.forms?.map((form) => {
      return defaults(
        pick(form, formKeys),
        zipObject(formKeys, Array(formKeys.length).fill(null)),
      ) as FormDto
    })

    return organizationDto
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const organization = createOrganizationDto as Organization
    const newOrganzation: Organization = new this.organizationModel(
      organization,
    )
    await newOrganzation.save()

    const keys = ['id', 'name', 'nationalId']
    const organizationDto: OrganizationDto = defaults(
      pick(newOrganzation, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationDto

    return organizationDto
  }
}
