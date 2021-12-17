import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PersonalRepresentativeAccess } from '../entities/models/personal-representative-access.model'
import { PersonalRepresentativeAccessDTO } from '../entities/dto/personal-representative-access.dto'
import { PaginatedPersonalRepresentativeAccessDto } from '../entities/dto/paginated-personal-representative-access.dto'
import { paginate, PaginationDto } from '@island.is/nest/pagination'

@Injectable()
export class PersonalRepresentativeAccessService {
  constructor(
    @InjectModel(PersonalRepresentativeAccess)
    private personalRepresentativeAccessModel: typeof PersonalRepresentativeAccess,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all personal repreasentatives  */
  async getMany(
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return await paginate({
      Model: this.personalRepresentativeAccessModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: {},
    })
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByPersonalRepresentative(
    nationalIdPersonalRepresentative: string,
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return await paginate({
      Model: this.personalRepresentativeAccessModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: {
        nationalIdPersonalRepresentative: nationalIdPersonalRepresentative,
      },
    })
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByRepresentedPerson(
    nationalIdRepresentedPerson: string,
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return await paginate({
      Model: this.personalRepresentativeAccessModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: {
        nationalIdRepresentedPerson: nationalIdRepresentedPerson,
      },
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
