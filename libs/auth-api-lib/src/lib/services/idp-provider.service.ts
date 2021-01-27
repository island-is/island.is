import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { IdpProviderDTO } from '../entities/dto/idp-provider.dto'
import { IdpRestriction } from '../entities/models/idp-restriction.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Op, Sequelize, WhereOptions } from 'sequelize'

@Injectable()
export class IdpProviderService {
  constructor(
    @InjectModel(IdpRestriction)
    private idpRestriction: typeof IdpRestriction,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(Sequelize)
    private sequelize: Sequelize,
  ) {}

  /** Gets all Idp Providers Types */
  async findAll(): Promise<IdpRestriction[] | null> {
    this.logger.debug('Getting all idp providers')
    return this.idpRestriction.findAll()
  }

  /** Gets Idp Provider by name */
  async find(name: string): Promise<IdpRestriction | null> {
    this.logger.debug('Getting all idp providers')
    return this.idpRestriction.findByPk(name)
  }

  /** Creates a new Idp Provider */
  async create(idpProvider: IdpProviderDTO) {
    this.logger.debug('creating and idp provider: ' + idpProvider)
    return this.idpRestriction.create(idpProvider)
  }

  /** Updates an Idp Provider */
  async update(
    idpProvider: IdpProviderDTO,
    name: string,
  ): Promise<[number, IdpRestriction[]] | null> {
    this.logger.debug('Updating a idp provider: ' + idpProvider)
    return this.idpRestriction.update(
      { ...idpProvider },
      { where: { name: name } },
    )
  }

  /** Deletes an Idp Provider */
  async delete(name: string) {
    this.logger.debug('Delete an idp provider with name: ' + name)
    return this.idpRestriction.destroy({ where: { name: name } })
  }
}
