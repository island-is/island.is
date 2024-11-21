import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormUrl } from './models/formUrl.model'
import { CreateFormUrlDto } from './models/dto/createFormUrl.dto'
import { FormUrlDto } from './models/dto/formUrl.dto'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Injectable()
export class FormUrlsService {
  constructor(
    @InjectModel(FormUrl)
    private readonly formUrlModel: typeof FormUrl,
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
  ) {}

  async create(createFormUrlDto: CreateFormUrlDto): Promise<FormUrlDto> {
    const organizationUrl = await this.organizationUrlModel.findByPk(
      createFormUrlDto.organizationUrlId,
    )

    if (!organizationUrl) {
      throw new NotFoundException(
        `organizationUrl with id '${createFormUrlDto.organizationUrlId}' not found`,
      )
    }

    const newFormUrl: FormUrl = new this.formUrlModel(
      createFormUrlDto as FormUrl,
    )

    await newFormUrl.save()

    const formUrlDto: FormUrlDto = {
      id: newFormUrl.id,
      organizationUrlId: newFormUrl.organizationUrlId,
      url: organizationUrl.url,
      isXroad: organizationUrl.isXroad,
      isTest: organizationUrl.isTest,
      type: organizationUrl.type,
      method: organizationUrl.method,
    }

    return formUrlDto
  }

  async delete(id: string): Promise<void> {
    const formUrl = await this.formUrlModel.findByPk(id)

    if (!formUrl) {
      throw new NotFoundException(`Form url with id '${id}' not found`)
    }

    formUrl.destroy()
  }
}
