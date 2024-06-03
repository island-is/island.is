import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { paginate } from '@island.is/nest/pagination'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { getPersonalRepresentativeDelegationType } from '@island.is/shared/types'

import { PaginatedPersonalRepresentativeDto } from '../dto/paginated-personal-representative.dto'
import { PaginationWithNationalIdsDto } from '../dto/pagination-with-national-ids.dto'
import { PersonalRepresentativeCreateDTO } from '../dto/personal-representative-create.dto'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'
import { PersonalRepresentativeRightType } from '../models/personal-representative-right-type.model'
import { PersonalRepresentativeRight } from '../models/personal-representative-right.model'
import { InactiveReason } from '../models/personal-representative.enum'
import { PersonalRepresentative } from '../models/personal-representative.model'
import { PersonalRepresentativeDelegationTypeModel } from '../models/personal-representative-delegation-type.model'
import { DelegationTypeModel } from '../../delegations/models/delegation-type.model'

type GetByPersonalRepresentativeOptions = {
  nationalIdPersonalRepresentative: string
  includeInactive?: boolean
  skipInactive?: boolean
}

@Injectable()
export class PersonalRepresentativeService {
  constructor(
    @InjectModel(PersonalRepresentative)
    private personalRepresentativeModel: typeof PersonalRepresentative,
    @InjectModel(PersonalRepresentativeRight)
    private personalRepresentativeRightModel: typeof PersonalRepresentativeRight,
    @InjectModel(PersonalRepresentativeRightType)
    private personalRepresentativeRightTypeModel: typeof PersonalRepresentativeRightType,
    @InjectModel(PersonalRepresentativeDelegationTypeModel)
    private personalRepresentativeDelegationTypeModel: typeof PersonalRepresentativeDelegationTypeModel,
    @InjectModel(DelegationTypeModel)
    private delegationTypeModel: typeof DelegationTypeModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private sequelize: Sequelize,
  ) {}

  /** Gets all personal representatives  */
  async getMany(
    includeInvalid: boolean,
    query: PaginationWithNationalIdsDto,
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

    if (query.personalRepresentativeId) {
      whereClause['nationalIdPersonalRepresentative'] =
        query.personalRepresentativeId
    }
    if (query.representedPersonId) {
      whereClause['nationalIdRepresentedPerson'] = query.representedPersonId
    }

    const result = await paginate<PersonalRepresentative>({
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

      rec.prDelegationTypes =
        await this.personalRepresentativeDelegationTypeModel.findAll({
          where: { personalRepresentativeId: rec.id },
          include: [DelegationTypeModel],
        })
    }

    return {
      ...result,
      data: result.data.map((rec) => rec.toDTO()),
    } as PaginatedPersonalRepresentativeDto
  }

  /** Gets all personal representative connections for personal representative  */
  async getByPersonalRepresentative(
    {
      nationalIdPersonalRepresentative,
      includeInactive = false,
      skipInactive = true,
    }: GetByPersonalRepresentativeOptions,
    useMaster = false,
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
      ...(skipInactive && { inactive: false }),
    }
    const whereClauseRights: WhereOptions = {}
    if (!includeInactive) {
      whereClause['validTo'] = validToClause
      whereClauseRights['validFrom'] = validFromClause
      whereClauseRights['validTo'] = validToClause
    }

    const personalRepresentatives =
      await this.personalRepresentativeModel.findAll({
        useMaster,
        where: whereClause,
        include: [
          {
            model: PersonalRepresentativeDelegationTypeModel,
            required: true,
            include: [DelegationTypeModel],
          },
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
      })

    return personalRepresentatives.map((pr) => pr.toDTO())
  }

  /** Gets all personal representative connections for personal representative  */
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

    const personalRepresentatives =
      await this.personalRepresentativeModel.findAll({
        where: whereClause,
        include: [
          {
            model: PersonalRepresentativeDelegationTypeModel,
            required: true,
            include: [DelegationTypeModel],
          },
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
      })

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

  /** Gets a personal representatives by id */
  async getPersonalRepresentative(
    id: string,
  ): Promise<PersonalRepresentativeDTO | null> {
    this.logger.debug(
      `Finding personal representative right type for id - "${id}"`,
    )

    const personalRepresentative =
      await this.personalRepresentativeModel.findByPk(id, {
        include: [
          {
            model: PersonalRepresentativeDelegationTypeModel,
            required: true,
            include: [DelegationTypeModel],
          },
          {
            model: PersonalRepresentativeRight,
            required: true,
            include: [PersonalRepresentativeRightType],
          },
        ],
      })

    return personalRepresentative?.toDTO() ?? null
  }

  /** Create a new personal representative */
  async create(
    personalRepresentative: PersonalRepresentativeCreateDTO,
  ): Promise<PersonalRepresentativeDTO | null> {
    // Create new personal representative connection

    try {
      return await this.sequelize.transaction(async (transaction) => {
        const newPr = await this.personalRepresentativeModel.create(
          { ...personalRepresentative },
          {
            transaction,
          },
        )

        const rightCodes = personalRepresentative.rightCodes.map(
          (rightCode) => {
            return {
              personalRepresentativeId: newPr.id,
              rightTypeCode: rightCode,
            }
          },
        )

        const createdPRR =
          await this.personalRepresentativeRightModel.bulkCreate(rightCodes, {
            transaction,
          })

        // Loop through the created PersonalRepresentativeRight and create a PersonalRepresentativeDelegationType for each,
        // this is done to use the same id for the PersonalRepresentativeDelegationType as the PersonalRepresentativeRight
        await Promise.all(
          createdPRR.map(async (c) => {
            try {
              const created =
                await this.personalRepresentativeDelegationTypeModel.create(
                  {
                    id: c.id,
                    personalRepresentativeId: newPr.id,
                    delegationTypeId: getPersonalRepresentativeDelegationType(
                      c.rightTypeCode,
                    ),
                  },
                  { transaction },
                )

              return created.id
            } catch (error) {
              // Check if error is due to foreign key constraint
              if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new BadRequestException(
                  `Error creating personal representative delegation type`,
                  error,
                )
              } else {
                throw error
              }
            }
          }),
        )

        /** To tackle replication we need to generate new object without selecting it from database */
        const result = newPr.toDTO()

        const rightTypes =
          await this.personalRepresentativeRightTypeModel.findAll({
            where: { code: rightCodes.map((rc) => rc.rightTypeCode) },
          })
        result.rights = rightTypes.map((rt) => rt.toDTO())

        const delegationTypes = await this.delegationTypeModel.findAll({
          where: {
            id: rightCodes.map((rc) =>
              getPersonalRepresentativeDelegationType(rc.rightTypeCode),
            ),
          },
        })
        result.prDelegationTypes = delegationTypes.map((prdt) => prdt.toDTO())

        return result
      })
    } catch (err) {
      throw new BadRequestException(
        `Error creating personal representative: ${err}`,
      )
    }
  }

  /** Delete a personal representative */
  async delete(id: string): Promise<PersonalRepresentative | null> {
    this.logger.debug('Deleting a personal representative with id: ', id)
    await this.personalRepresentativeRightModel.destroy({
      where: { personalRepresentativeId: id },
    })

    await this.personalRepresentativeDelegationTypeModel.destroy({
      where: { personalRepresentativeId: id },
    })

    const personalRepresentative =
      await this.personalRepresentativeModel.findByPk(id)

    await this.personalRepresentativeModel.destroy({
      where: { id: id },
    })

    return personalRepresentative
  }

  async makeInactive(id: string) {
    this.logger.debug('Making personal representative inactive for id: ', id)

    const result = await this.personalRepresentativeModel.update(
      {
        inactive: true,
        inactiveReason: InactiveReason.DECEASED_PARTY,
      },
      {
        where: {
          id,
        },
      },
    )

    return result
  }
}
