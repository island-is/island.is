import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
import { ApplicationDto } from './models/dto/application.dto'

@Injectable()
export class ApplicationsXRoadService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    private readonly applicationMapper: ApplicationMapper,
  ) {}

  async getApplication(id: string): Promise<ApplicationDto> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new Error(`Application with id ${id} not found`)
    }

    const form = await this.formModel.findByPk(application.formId)

    if (!form) {
      throw new Error(`Form for application id ${id} not found`)
    }

    return this.applicationMapper.mapFormToApplicationDto(form, application)
  }
}
