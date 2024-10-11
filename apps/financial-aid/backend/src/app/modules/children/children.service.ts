import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ChildrenModel } from './models'

import { CreateApplicationChildrenDto } from '../application/dto'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ChildrenService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(ChildrenModel)
    private readonly childrenModel: typeof ChildrenModel,
  ) {}

  async findById(id: string): Promise<ChildrenModel[]> {
    this.logger.debug('Finding children by application id')
    return this.childrenModel.findAll({
      where: {
        applicationId: id,
      },
      order: [['created', 'DESC']],
    })
  }

  async create(children: CreateApplicationChildrenDto): Promise<ChildrenModel> {
    this.logger.debug('Adding child')
    return this.childrenModel.create(children)
  }
}
