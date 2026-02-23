import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationMapper } from './models/application.mapper'
import { ApplicationDto } from './models/dto/application.dto'
import { ApplicationsService } from './applications.service'

@Injectable()
export class ApplicationsXRoadService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    private readonly applicationMapper: ApplicationMapper,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async getApplication(id: string): Promise<ApplicationDto> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`)
    }

    const form = await this.applicationsService.getApplicationForm(
      application.formId,
      id,
      application.formSlug ?? '',
    )

    if (!form) {
      throw new NotFoundException(`Form for application id ${id} not found`)
    }

    return this.applicationMapper.mapFormToApplicationDto(form, application)
  }
}
