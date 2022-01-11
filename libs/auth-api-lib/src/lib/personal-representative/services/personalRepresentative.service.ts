import { Sequelize } from 'sequelize-typescript'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op, WhereOptions } from 'sequelize'
import { PersonalRepresentative } from '../entities/models/personal-representative.model'
import { PersonalRepresentativeRight } from '../entities/models/personal-representative-right.model'
import { PersonalRepresentativeRightType } from '../entities/models/personal-representative-right-type.model'
import { PersonalRepresentativeDTO } from '../entities/dto/personal-representative.dto'
import { PersonalRepresentativeCreateDTO } from '../entities/dto/personal-representative-create.dto'
import { PaginatedPersonalRepresentativeDto } from '../entities/dto/paginated-personal-representative.dto'
import { paginate, PaginationDto } from '@island.is/nest/pagination'

@Injectable()
export class PersonalRepresentativeService {
  constructor(
    @InjectModel(PersonalRepresentative)
    private personalRepresentativeModel: typeof PersonalRepresentative,
    @InjectModel(PersonalRepresentativeRight)
    private personalRepresentativeRightModel: typeof PersonalRepresentativeRight,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private sequelize: Sequelize,
  ) {}

  /** Get's all personal repreasentatives  */
  async getMany(
    includeInvalid: boolean,
    query: PaginationDto,
    personalRepresentativeId?: string,
    representedPersonId?: string,
  ): Promise<PaginatedPersonalRepresentativeDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validToClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validFromClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.lt]: new Date() },
    }
    const whereClause: WhereOptions = {}
    const whereClauseRights: WhereOptions = {}
    if (!includeInvalid) {
      whereClause['validTo'] = validToClause
      whereClauseRights['validFrom'] = validFromClause
      whereClauseRights['validTo'] = validToClause
    }

    if (personalRepresentativeId) {
      whereClause['nationalIdPersonalRepresentative'] = personalRepresentativeId
    }
    if (representedPersonId) {
      whereClause['nationalIdRepresentedPerson'] = representedPersonId
    }

    const result = await paginate({
      Model: this.personalRepresentativeModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: whereClause,
    })

    // Since paginate in sequlize does not support include correctly we need to fetch the rights array separately
    for await (const rec of result.data) {
      rec.rights = await this.personalRepresentativeRightModel.findAll({
        where: { personalRepresentativeId: rec.id },
        include: [
          {
            model: PersonalRepresentativeRightType,
            required: true,
            where: whereClauseRights,
          },
        ],
      })
    }

    result.data = result.data.map((rec) => rec.toDTO())
    return result
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByPersonalRepresentative(
    nationalIdPersonalRepresentative: string,
    includeInvalid: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validToClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validFromClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.lt]: new Date() },
    }
    const whereClause: WhereOptions = {
      nationalIdPersonalRepresentative: nationalIdPersonalRepresentative,
    }
    const whereClauseRights: WhereOptions = {}
    if (!includeInvalid) {
      whereClause['validTo'] = validToClause
      whereClauseRights['validFrom'] = validFromClause
      whereClauseRights['validTo'] = validToClause
    }
    const personalRepresentatives = await this.personalRepresentativeModel.findAll(
      {
        where: whereClause,
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
            include: [
              {
                model: PersonalRepresentativeRightType,
                required: true,
                where: whereClauseRights,
              },
            ],
          },
        ],
      },
    )
    return personalRepresentatives.map((pr) => pr.toDTO())
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getPersonalRepresentativeByRepresentedPerson(
    nationalIdRepresentedPerson: string,
    includeInvalid: boolean,
  ): Promise<PersonalRepresentativeDTO | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validToClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validFromClause: any = {
      [Op.or]: { [Op.eq]: null, [Op.lt]: new Date() },
    }
    const whereClause: WhereOptions = {
      nationalIdRepresentedPerson: nationalIdRepresentedPerson,
    }
    const whereClauseRights: WhereOptions = {}
    if (!includeInvalid) {
      whereClause['validTo'] = validToClause
      whereClauseRights['validFrom'] = validFromClause
      whereClauseRights['validTo'] = validToClause
    }
    const personalRepresentatives = await this.personalRepresentativeModel.findAll(
      {
        where: whereClause,
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
            include: [
              {
                model: PersonalRepresentativeRightType,
                required: true,
                where: whereClauseRights,
              },
            ],
          },
        ],
      },
    )
    if (personalRepresentatives.length === 0) {
      return null
    }
    if (personalRepresentatives.length > 1) {
      this.logger.error(
        `More than one personal representative, this is not allowed, please check data for represented person in row: ${personalRepresentatives[0].id}`,
      )
      throw new BadRequestException(
        'More than one personal representative, this is not allowed, please check data',
      )
    }
    return personalRepresentatives[0].toDTO()
  }

  /** Get's a personal repreasentatives by id */
  async getPersonalRepresentative(
    id: string,
  ): Promise<PersonalRepresentativeDTO | null> {
    this.logger.debug(
      `Finding personal representative right type for id - "${id}"`,
    )
    const personalRepresentative = await this.personalRepresentativeModel.findByPk(
      id,
      {
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
          },
        ],
      },
    )
    return personalRepresentative ? personalRepresentative.toDTO() : null
  }

  /** Create a new personal repreasentative */
  async create(
    personalRepresentative: PersonalRepresentativeCreateDTO,
  ): Promise<PersonalRepresentativeDTO | null> {
    // Create new personal representative connection
    let prId = ''
    try {
      await this.sequelize.transaction(async (t) => {
        const newPr = await this.personalRepresentativeModel.create(
          personalRepresentative,
          { transaction: t },
        )

        const rightCodes = personalRepresentative.rightCodes.map(
          (rightCode) => {
            return {
              personalRepresentativeId: newPr.id,
              rightTypeCode: rightCode,
            }
          },
        )

        await this.personalRepresentativeRightModel.bulkCreate(rightCodes, {
          transaction: t,
        })
        prId = newPr.id
      })

      const result = await this.personalRepresentativeModel.findByPk(prId, {
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
            include: [PersonalRepresentativeRightType],
          },
        ],
      })

      return result ? result.toDTO() : null
    } catch (err) {
      throw new BadRequestException(
        `Error creating personal representative: ${err}`,
      )
    }
  }

  /** Delete a personal repreasentative */
  async delete(id: string): Promise<number> {
    this.logger.debug('Deleting a personal representative with id: ', id)
    await this.personalRepresentativeRightModel.destroy({
      where: { personalRepresentativeId: id },
    })

    return await this.personalRepresentativeModel.destroy({
      where: { id: id },
    })
  }
}
