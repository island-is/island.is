import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'

import { CreateIcelandicNameBodyDto, UpdateIcelandicNameBodyDto } from './dto'
import IcelandicName from './icelandic-name.model'

@Injectable()
export class IcelandicNameService {
  constructor(
    @InjectModel(IcelandicName)
    private readonly icelandicNameModel: typeof IcelandicName,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<IcelandicName[]> {
    this.logger.debug('Getting all icelandic names')

    return this.icelandicNameModel.findAll({
      order: ['icelandicName'],
      raw: true,
    })
  }

  getByInitialLetter(initialLetter: string): Promise<IcelandicName[]> {
    this.logger.debug(
      `Getting all icelandic names by inital letter: "${initialLetter}"`,
    )

    return this.icelandicNameModel.findAll({
      where: {
        icelandicName: {
          [Op.startsWith]: initialLetter.toLowerCase(),
        },
      },
      order: ['icelandicName'],
    })
  }

  getBySearch(q: string): Promise<IcelandicName[]> {
    this.logger.debug(`Getting all icelandic names by search: "${q}"`)

    return this.icelandicNameModel.findAll({
      where: {
        icelandicName: {
          [Op.iLike]: `%${q.trim()}%`,
        },
      },
      order: ['icelandicName'],
    })
  }

  getById(id: number): Promise<IcelandicName | null> {
    this.logger.debug(`Getting name by id: ${id}`)

    return this.icelandicNameModel.findOne({
      where: {
        id,
      },
    })
  }

  updateNameById(
    id: number,
    body: UpdateIcelandicNameBodyDto,
  ): Promise<[number, IcelandicName[]]> {
    this.logger.debug(`Updating name by id: ${id}`)

    return this.icelandicNameModel.update(body, {
      where: { id },
      returning: true,
    })
  }

  createName(body: CreateIcelandicNameBodyDto): Promise<IcelandicName> {
    this.logger.debug(`Creating new name`)

    return this.icelandicNameModel.create(body, {
      raw: true,
    })
  }

  deleteById(id: number): Promise<number> {
    this.logger.debug(`Deleting name by id: ${id}`)

    return this.icelandicNameModel.destroy({ where: { id } })
  }
}
