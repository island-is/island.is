import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, WhereOptions } from 'sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { GrantDto } from './dto/grant.dto'
import { Grant } from './models/grants.model'

import type { Logger } from '@island.is/logging'

@Injectable()
export class GrantsService {
  constructor(
    @InjectModel(Grant)
    private grantModel: typeof Grant,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all grants and count */
  async findAndCountAll(): Promise<{ rows: Grant[]; count: number } | null> {
    return this.grantModel.findAndCountAll({ useMaster: true })
  }

  /** Gets grants by provided parameters */
  async getAllAsync(
    subjectId: string,
    sessionId: string,
    clientId: string,
    type: string,
  ): Promise<Grant[]> {
    let whereOptions: WhereOptions = {}

    if (subjectId) {
      whereOptions = { ...whereOptions, subjectId: subjectId }
    }

    if (sessionId) {
      whereOptions = { ...whereOptions, sessionId: sessionId }
    }

    if (clientId) {
      whereOptions = { ...whereOptions, clientId: clientId }
    }

    if (type) {
      whereOptions = { ...whereOptions, type: type }
    }

    this.logger.debug(`Finding all grants with filter `, whereOptions)

    return this.grantModel.findAll({
      where: whereOptions,
      useMaster: true,
    })
  }

  /** Gets a grant by it's key */
  async getAsync(key: string): Promise<Grant | null> {
    this.logger.debug(`Finding grant with key - "${key}"`)

    if (!key) {
      throw new BadRequestException('Key must be provided')
    }

    return this.grantModel.findByPk(key, { useMaster: true })
  }

  /** Removes a grant by subjectId and other properties if provided */
  async removeAllAsync(
    subjectId: string,
    sessionId?: string,
    clientId?: string,
    type?: string,
  ): Promise<number> {
    if (!subjectId) {
      throw new BadRequestException('subjectId must be specified.')
    }

    let whereOptions: WhereOptions = { subjectId: subjectId }

    if (sessionId) {
      whereOptions = { ...whereOptions, sessionId: sessionId }
    }

    if (clientId) {
      whereOptions = { ...whereOptions, clientId: clientId }
    }

    if (type) {
      whereOptions = { ...whereOptions, type: type }
    }

    this.logger.debug(`Removing grants with filter `, whereOptions)

    return this.grantModel.destroy({
      where: whereOptions,
    })
  }

  /** Removes a grant by key */
  async removeAsync(key: string): Promise<number> {
    this.logger.debug(`Removing grant with key - "${key}"`)

    if (!key) {
      throw new BadRequestException('Key must be provided')
    }

    return this.grantModel.destroy({
      where: {
        key: key,
      },
    })
  }

  /** Creates a grant */
  async createAsync(grant: GrantDto): Promise<Grant> {
    this.logger.debug(`Creating a new grant`)

    return await this.grantModel.create({ ...grant })
  }

  async updateAsync(key: string, grant: GrantDto): Promise<Grant> {
    this.logger.debug(`Updating grant`)

    const existing = await this.grantModel.findByPk(key, { useMaster: true })

    if (!existing) {
      return this.createAsync(grant)
    }

    return existing.update({ ...grant })
  }

  async deleteExpired(): Promise<number> {
    return this.grantModel.destroy({
      where: {
        expiration: {
          [Op.lt]: new Date(),
        },
      },
    })
  }
}
