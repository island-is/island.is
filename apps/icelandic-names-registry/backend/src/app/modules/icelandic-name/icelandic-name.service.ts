import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'

import { CreateIcelandicNameBody, UpdateIcelandicNameBody } from './dto'
import { IcelandicName } from './icelandic-name.model'

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
      order: ['icelandic_name'],
      raw: true,
    })
  }

  getByInitialLetter(initialLetter: string): Promise<IcelandicName[]> {
    this.logger.debug(
      `Getting all icelandic names by inital letter: "${initialLetter}"`,
    )

    return this.icelandicNameModel.findAll({
      where: {
        icelandic_name: {
          [Op.or]: {
            [Op.startsWith]: initialLetter.toLowerCase(),
            [Op.startsWith]: initialLetter.toUpperCase(),
          },
        },
      },
      order: ['icelandic_name'],
    })
  }

  getBySearch(q: string): Promise<IcelandicName[]> {
    this.logger.debug(`Getting all icelandic names by search: "${q}"`)

    return this.icelandicNameModel.findAll({
      where: {
        icelandic_name: {
          [Op.iLike]: `%${q.trim()}%`,
        },
      },
      order: ['icelandic_name'],
    })
  }

  getById(id: number): Promise<IcelandicName> {
    this.logger.debug(`Getting name by id: ${id}`)

    return this.icelandicNameModel.findOne({
      where: {
        id,
      },
    })
  }

  updateNameById(
    id: number,
    body: UpdateIcelandicNameBody,
  ): Promise<[number, IcelandicName[]]> {
    this.logger.debug(`Updating name by id: ${id}`)

    return this.icelandicNameModel.update(body, {
      where: { id },
      returning: true,
    })
  }

  createName(body: CreateIcelandicNameBody): Promise<IcelandicName> {
    this.logger.debug(`Creating new name`)

    return this.icelandicNameModel.create(body)
  }

  deleteById(id: number): Promise<number> {
    this.logger.debug(`Deleting name by id: ${id}`)

    return this.icelandicNameModel.destroy({ where: { id } })
  }
}
