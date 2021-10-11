import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationEventModel } from './models'

import { CreateApplicationEventDto } from '../application/dto'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class ApplicationEventService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(ApplicationEventModel)
    private readonly applicationEventModel: typeof ApplicationEventModel,
  ) {}

  async getAll(): Promise<ApplicationEventModel[]> {
    this.logger.debug('Getting all application events')
    return this.applicationEventModel.findAll()
  }

  async findById(id: string): Promise<ApplicationEventModel[]> {
    this.logger.debug('Finding application event by id')
    return this.applicationEventModel.findAll({
      where: {
        applicationId: id,
      },
      order: [['created', 'DESC']],
    })
  }

  async create(
    applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationEventModel> {
    this.logger.debug('Creating a new application event')
    return this.applicationEventModel.create(applicationEvent)
  }
}
