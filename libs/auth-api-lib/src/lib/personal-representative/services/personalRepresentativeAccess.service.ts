import { uuid } from 'uuidv4'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { WhereOptions } from 'sequelize'
import { PersonalRepresentativeAccess } from '../entities/models/personal-representative-access.model'
import { PersonalRepresentativeAccessDTO } from '../entities/dto/personal-representative-access.dto'

@Injectable()
export class PersonalRepresentativeAccessService {
  constructor(
    @InjectModel(PersonalRepresentativeAccess)
    private personalRepresentativeAccessModel: typeof PersonalRepresentativeAccess,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all personal repreasentatives  */
  async getMany(): Promise<PersonalRepresentativeAccess[]> {
    return await this.personalRepresentativeAccessModel.findAll()
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByPersonalRepresentative(
    nationalIdPersonalRepresentative: string,
  ): Promise<PersonalRepresentativeAccess[]> {
    const whereClause: WhereOptions = {
      nationalIdPersonalRepresentative: nationalIdPersonalRepresentative,
    }
    return await this.personalRepresentativeAccessModel.findAll({
      where: whereClause,
    })
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByRepresentedPerson(
    nationalIdRepresentedPerson: string,
  ): Promise<PersonalRepresentativeAccess[] | null> {
    const whereClause: WhereOptions = {
      nationalIdRepresentedPerson: nationalIdRepresentedPerson,
    }
    return await this.personalRepresentativeAccessModel.findAll({
      where: whereClause,
    })
  }

  /** Create a new personal repreasentative access record */
  async logAccess(
    personalRepresentativeAccess: PersonalRepresentativeAccessDTO,
  ): Promise<PersonalRepresentativeAccess | null> {
    // Create new personal representative connection
    try {
      this.logger.info('Creating personal representative access log')
      return await this.personalRepresentativeAccessModel.create(
        personalRepresentativeAccess,
      )
    } catch (err) {
      this.logger.error(
        `Error creating personal representative access log: ${err}`,
      )
      throw new BadRequestException(
        `Error creating personal representative access log: ${err}`,
      )
    }
  }
}
