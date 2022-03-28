import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { GrantType } from '../entities/models/grant-type.model'
import { GrantTypeDTO } from '../entities/dto/grant-type.dto'

@Injectable()
export class GrantTypeService {
  constructor(
    @InjectModel(GrantType)
    private grantTypeModel: typeof GrantType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all Grant Types  */
  async findAll(): Promise<GrantType[] | null> {
    return this.grantTypeModel.findAll({ where: { archived: null } })
  }

  /** Get's all Grant Types and count */
  async findAndCountAll(
    page: number,
    count: number,
    includeArchived: boolean,
  ): Promise<{
    rows: GrantType[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.grantTypeModel.findAndCountAll({
      limit: count,
      offset: offset,
      where: includeArchived ? {} : { archived: null },
      order: ['name'],
    })
  }

  /** Get's all Grant Types and count by searchstring */
  async find(
    searchString: string,
    page: number,
    count: number,
    includeArchived: boolean,
  ): Promise<{
    rows: GrantType[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.grantTypeModel.findAndCountAll({
      limit: count,
      offset: offset,
      where: includeArchived
        ? { name: searchString }
        : { name: searchString, archived: null },
      order: ['name'],
    })
  }

  /** Get's a grant type by name */
  async getGrantType(name: string): Promise<GrantType | null> {
    this.logger.debug(`Finding grant type for name - "${name}"`)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.grantTypeModel.findByPk(name)
  }

  /** Creat a new grant type */
  async create(grantType: GrantTypeDTO): Promise<GrantType | null> {
    this.logger.debug(`Creating grant type with name - "${grantType.name}"`)

    return this.grantTypeModel.create({ ...grantType })
  }

  /** Updates an existing grant */
  async update(
    grantType: GrantTypeDTO,
    name: string,
  ): Promise<GrantType | null> {
    this.logger.debug('Updating grantType with name ', name)

    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    await this.grantTypeModel.update(
      { ...grantType },
      {
        where: { name: name },
      },
    )

    return await this.grantTypeModel.findByPk(grantType.name)
  }

  /** Soft delete on a grant type by name */
  async delete(name: string): Promise<number> {
    this.logger.debug('Soft deleting a grant type with name: ', name)

    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    const result = await this.grantTypeModel.update(
      { archived: new Date() },
      {
        where: { name: name },
      },
    )

    return result[0]
  }
}
