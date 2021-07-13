import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationEventModel } from './models'

import { CreateApplicationEventDto } from './dto'

@Injectable()
export class ApplicationEventService {
  constructor(
    @InjectModel(ApplicationEventModel)
    private readonly applicationEventModel: typeof ApplicationEventModel,
  ) {}

  getAll(): Promise<ApplicationEventModel[]> {
    return this.applicationEventModel.findAll()
  }

  findById(id: string): Promise<ApplicationEventModel | null> {
    return this.applicationEventModel.findOne({
      where: { id },
    })
  }

  create(
    applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationEventModel> {
    // this.logger.debug('Creating a new application event')
    return this.applicationEventModel.create(applicationEvent)
  }
}
