import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
  ) {}

  create(formId: string): ApplicationDto {
    return new ApplicationDto()
  }

  getPreview(formId: string): ApplicationDto {
    return new ApplicationDto()
  }
}
