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

  async getAll(): Promise<ApplicationEventModel[]> {
    return this.applicationEventModel.findAll()
  }

  async findById(id: string): Promise<ApplicationEventModel | null> {
    return this.applicationEventModel.findOne({
      where: { id },
    })
  }

  async create(
    applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationEventModel> {
    // this.logger.debug('Creating a new application event')
    return this.applicationEventModel.create(applicationEvent)
  }
}
