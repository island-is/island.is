import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { IdpProviderDTO } from '../entities/dto/idp-provider.dto'
import { IdpProvider } from '../entities/models/idp-provider.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class IdpProviderService {
  constructor(
    @InjectModel(IdpProvider)
    private idpProvider: typeof IdpProvider,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(Sequelize)
    private sequelize: Sequelize,
  ) {}

  /** Gets all Idp Providers Types */
  async findAndCountAll(
    page: number,
    count: number,
  ): Promise<{ rows: IdpProvider[]; count: number } | null> {
    page--
    const offset = page * count
    this.logger.debug('Getting all idp providers')
    return this.idpProvider.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
      order: ['name'],
    })
  }

  /** Gets Idp provider where name equals parameter */
  async find(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{ rows: IdpProvider[]; count: number } | null> {
    page--
    const offset = page * count
    this.logger.debug(
      'Getting all idp providers with search string: ' + searchString,
    )
    return this.idpProvider.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
      where: { name: searchString },
      order: ['name'],
    })
  }

  /** Gets all Idp Providers Types */
  async findAll(): Promise<IdpProvider[] | null> {
    this.logger.debug('Getting all idp providers')
    return this.idpProvider.findAll()
  }

  /** Gets Idp Provider by name */
  async findByPk(name: string): Promise<IdpProvider | null> {
    this.logger.debug('Getting all idp providers')
    return this.idpProvider.findByPk(name)
  }

  /** Creates a new Idp Provider */
  async create(idpProvider: IdpProviderDTO) {
    this.logger.debug('creating and idp provider: ' + idpProvider)
    return this.idpProvider.create({ ...idpProvider })
  }

  /** Updates an Idp Provider */
  async update(
    idpProvider: IdpProviderDTO,
    name: string,
  ): Promise<[number, IdpProvider[]] | null> {
    this.logger.debug('Updating a idp provider: ' + idpProvider)
    return this.idpProvider.update(
      { ...idpProvider },
      { where: { name: name }, returning: true },
    )
  }

  /** Deletes an Idp Provider */
  async delete(name: string) {
    this.logger.debug('Delete an idp provider with name: ' + name)
    return this.idpProvider.destroy({ where: { name: name } })
  }
}
