import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormUrl } from './models/formUrl.model'
import { FormUrlDto } from '@island.is/form-system/shared'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Injectable()
export class FormUrlsService {
  constructor(
    @InjectModel(FormUrl)
    private readonly formUrlModel: typeof FormUrl,
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
  ) {}

  async create(createFormUrlDto: FormUrlDto): Promise<FormUrlDto> {
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
      organizationUrlId: newFormUrl.organizationUrlId,
      formId: newFormUrl.formId,
    }

    return formUrlDto
  }

  async delete(deleteFormUrlDto: FormUrlDto): Promise<void> {
    const formUrl = await this.formUrlModel.findOne({
      where: {
        formId: deleteFormUrlDto.formId,
        organizationUrlId: deleteFormUrlDto.organizationUrlId,
      },
    })

    if (!formUrl) {
      throw new NotFoundException(
        `Form url with formId '${deleteFormUrlDto.formId}' and organizationUrlId '${deleteFormUrlDto.organizationUrlId}' not found`,
      )
    }

    formUrl.destroy()
  }
}
