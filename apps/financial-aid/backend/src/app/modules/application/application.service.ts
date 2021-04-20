import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationModel } from './models'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  getAll(): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll()
  }
}
