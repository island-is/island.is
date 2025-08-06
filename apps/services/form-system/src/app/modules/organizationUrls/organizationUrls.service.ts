import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { OrganizationUrl } from './models/organizationUrl.model'
import { CreateOrganizationUrlDto } from './models/dto/createOrganizationUrl.dto'
import { OrganizationUrlDto } from './models/dto/organizationUrl.dto'
import { UpdateOrganizationUrlDto } from './models/dto/updateOrganizationUrl.dto'
import { UrlMethods, UrlTypes } from '@island.is/form-system/shared'
import { Organization } from '../organizations/models/organization.model'
import { FormUrl } from '../formUrls/models/formUrl.model'

@Injectable()
export class OrganizationUrlsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
    @InjectModel(FormUrl)
    private readonly formUrlModel: typeof FormUrl,
  ) {}

  async create(
    createOrganizationUrlDto: CreateOrganizationUrlDto,
  ): Promise<OrganizationUrlDto> {
    const organization = await this.organizationModel.findOne({
      where: {
        nationalId: createOrganizationUrlDto.organizationNationalId,
      },
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId '${createOrganizationUrlDto.organizationNationalId}' not found`,
      )
    }

    const type = createOrganizationUrlDto.type
    const urlTypes = Object.values(UrlTypes)

    let isValidType = false
    urlTypes.map((urlType) => {
      if (urlType === type) isValidType = true
    })

    if (!isValidType) {
      throw new NotFoundException(`url type with id '${type}' not found`)
    }

    const newOrganizationUrl: OrganizationUrl = new this.organizationUrlModel()
    newOrganizationUrl.organizationId = organization.id
    newOrganizationUrl.type = createOrganizationUrlDto.type
    newOrganizationUrl.isTest = createOrganizationUrlDto.isTest
    newOrganizationUrl.method = createOrganizationUrlDto.method
    newOrganizationUrl.isXroad = false

    if (createOrganizationUrlDto.method === UrlMethods.SEND_TO_ZENDESK) {
      newOrganizationUrl.url = 'Zendesk'
    }
    await newOrganizationUrl.save()

    const keys = ['id', 'url', 'isXroad', 'isTest', 'type', 'method']
    const organizationUrlDto: OrganizationUrlDto = defaults(
      pick(newOrganizationUrl, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationUrlDto

    return organizationUrlDto
  }

  async update(
    id: string,
    updateOrganizationUrlDto: UpdateOrganizationUrlDto,
  ): Promise<void> {
    const method = updateOrganizationUrlDto.method
    const urlMethods = Object.values(UrlMethods)

    let isValidMethod = false
    urlMethods.map((urlMethod) => {
      if (urlMethod === method) isValidMethod = true
    })

    if (method && !isValidMethod) {
      throw new NotFoundException(`url method with id '${method}' not found`)
    }

    const organizationUrl = await this.organizationUrlModel.findByPk(id)

    if (!organizationUrl) {
      throw new NotFoundException(`Organization url with id '${id}' not found`)
    }

    Object.assign(organizationUrl, updateOrganizationUrlDto)

    await organizationUrl.save()
  }

  async delete(id: string): Promise<void> {
    const organizationUrl = await this.organizationUrlModel.findByPk(id)

    if (!organizationUrl) {
      throw new NotFoundException(`Organization url with id '${id}' not found`)
    }

    await this.formUrlModel.destroy({
      where: { organizationUrlId: id },
    })

    await organizationUrl.destroy()
  }
}
