import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PersonalRepresentativeAccess } from '../entities/models/personal-representative-access.model'
import { PersonalRepresentativeAccessDTO } from '../entities/dto/personal-representative-access.dto'
import { PaginatedPersonalRepresentativeAccessDto } from '../entities/dto/paginated-personal-representative-access.dto'
import { PaginationWithNationalIdsDto } from '../entities/dto/pagination-with-national-ids.dto'
import { paginate } from '@island.is/nest/pagination'
import { Op } from 'sequelize'

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
    query: PaginationWithNationalIdsDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    const where =
      query.personalRepresentativeId && query.representedPersonId
        ? {
            [Op.and]: [
              {
                nationalIdPersonalRepresentative:
                  query.personalRepresentativeId,
              },
              {
                nationalIdRepresentedPerson: query.representedPersonId,
              },
            ],
          }
        : query.personalRepresentativeId
        ? {
            nationalIdPersonalRepresentative: query.personalRepresentativeId,
          }
        : query.representedPersonId
        ? {
            nationalIdRepresentedPerson: query.representedPersonId,
          }
        : {}
    return paginate({
      Model: this.personalRepresentativeAccessModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: where,
    })
  }

  /** Create a new personal repreasentative access record */
  async logAccess(
    personalRepresentativeAccess: PersonalRepresentativeAccessDTO,
  ): Promise<PersonalRepresentativeAccess | null> {
    // Create new personal representative connection
    try {
      this.logger.info('Creating personal representative access log')
      return this.personalRepresentativeAccessModel.create({
        ...personalRepresentativeAccess,
      })
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
