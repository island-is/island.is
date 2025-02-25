import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { OrganizationUrl } from './models/organizationUrl.model'
import { CreateOrganizationUrlDto } from './models/dto/createOrganizationUrl.dto'
import { OrganizationUrlDto } from './models/dto/organizationUrl.dto'
import { UrlTypes } from '../../enums/urlTypes'
import { UpdateOrganizationUrlDto } from './models/dto/updateOrganizationUrl.dto'
import { UrlMethods } from '../../enums/urlMethods'

@Injectable()
export class OrganizationUrlsService {
  constructor(
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
  ) {}

  async create(
    createOrganizationUrlDto: CreateOrganizationUrlDto,
  ): Promise<OrganizationUrlDto> {
    const type = createOrganizationUrlDto.type
    const urlTypes = Object.values(UrlTypes)

    let isValidType = false
    urlTypes.map((urlType) => {
      if (urlType === type) isValidType = true
    })

    if (!isValidType) {
      throw new NotFoundException(`url type with id '${type}' not found`)
    }

    const newOrganizationUrl: OrganizationUrl = new this.organizationUrlModel(
      createOrganizationUrlDto as OrganizationUrl,
    )

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

    organizationUrl.destroy()
  }
}
