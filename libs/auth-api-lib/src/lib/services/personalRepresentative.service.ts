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

  private validToClause = {
    [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() },
  }
  /** Get's all personal repreasentatives  */
  async getAllAsync(
    includeInvalid: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    const whereClause: WhereOptions = includeInvalid
      ? {}
      : { validTo: this.validToClause }
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
                where: whereClause,
              },
            ],
          },
        ],
      },
    )
    return personalRepresentatives.map((pr) => pr.toDTO())
  }

  /** Get's all personal repreasentative connections for personal representative  */
  async getByPersonalRepresentativeAsync(
    nationalIdPersonalRepresentative: string,
    includeInvalid: boolean,
  ): Promise<PersonalRepresentativeDTO[]> {
    const whereClause: WhereOptions = {
      nationalIdPersonalRepresentative: nationalIdPersonalRepresentative,
    }
    const whereClauseRights: WhereOptions = {}
    if (!includeInvalid) {
      whereClause['validTo'] = this.validToClause
      whereClauseRights['validTo'] = this.validToClause
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
  async getPersonalRepresentativeByRepresentedPersonAsync(
    nationalIdRepresentedPerson: string,
    includeInvalid: boolean,
  ): Promise<PersonalRepresentativeDTO | null> {
    const whereClause: WhereOptions = {
      nationalIdRepresentedPerson: nationalIdRepresentedPerson,
    }
    const whereClauseRights: WhereOptions = {}
    if (!includeInvalid) {
      whereClause['validTo'] = this.validToClause
      whereClauseRights['validTo'] = this.validToClause
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

  /** Get's all personal repreasentatives and count */
  async getAndCountAllAsync(
    page: number,
    count: number,
    includeInvalid: boolean,
  ): Promise<{
    rows: PersonalRepresentativeDTO[]
    count: number
  }> {
    page--
    const offset = page * count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = includeInvalid
      ? {}
      : { validTo: this.validToClause }
    const personalRepresentatives = await this.personalRepresentativeModel.findAndCountAll(
      {
        limit: count,
        offset: offset,
        where: whereClause,
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
            where: whereClause,
          },
        ],
      },
    )
    return {
      rows: personalRepresentatives.rows.map((pr) => pr.toDTO()),
      count: personalRepresentatives.count,
    }
  }

  /** Get's all personal repreasentatives and count by searchstring */
  async findAsync(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: PersonalRepresentativeDTO[]
    count: number
  }> {
    page--
    const offset = page * count
    const personalRepresentatives = await this.personalRepresentativeModel.findAndCountAll(
      {
        limit: count,
        offset: offset,
        include: [
          {
            model: PersonalRepresentativeRight,
            required: true,
          },
        ],
        where: {
          [Op.or]: [
            {
              name: { [Op.like]: searchString },
            },
            {
              code: { [Op.like]: searchString },
            },
          ],
        },
      },
    )
    return {
      rows: personalRepresentatives.rows.map((pr) => pr.toDTO()),
      count: personalRepresentatives.count,
    }
  }

  /** Get's a personal repreasentatives by id */
  async getPersonalRepresentativeAsync(
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
  async createAsync(
    personalRepresentative: PersonalRepresentativeDTO,
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
  async deleteAsync(id: string): Promise<number> {
    this.logger.debug('Deleting a personal representative with id: ', id)
    await this.personalRepresentativeRightModel.destroy({
      where: { personalRepresentativeId: id },
    })

    return await this.personalRepresentativeModel.destroy({
      where: { id: id },
    })
  }
}
