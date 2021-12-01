import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'
import { PersonalRepresentativeRight } from '../entities/models/personal-representative-right.model'
import { PersonalRepresentative } from '../entities/models/personal-representative.model'
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
  ) {}

  /** Get's all personal repreasentatives  */
  async getAllAsync(): Promise<PersonalRepresentativeDTO[]> {
    const personalRepresentatives = await this.personalRepresentativeModel.findAll()
    return personalRepresentatives.map((pr) => pr.toDTO())
  }

  /** Get's all personal repreasentatives and count */
  async getAndCountAllAsync(
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
        where: {
          $or: [
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

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }
    const personalRepresentative = await this.personalRepresentativeModel.findByPk(
      id,
    )
    return personalRepresentative ? personalRepresentative.toDTO() : null
  }
}
