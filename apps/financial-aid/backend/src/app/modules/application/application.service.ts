import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationModel } from './models'

import { CreateApplicationDto } from './dto'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll()
  }

  create(application: CreateApplicationDto): Promise<ApplicationModel> {
    // this.logger.debug('Creating a new case')
    return this.applicationModel.create(application)
  }
}
