import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'
import { PersonalRepresentativeRightType } from '../entities/models/personal-representative-right-type.model'
import { PersonalRepresentativeRightTypeDTO } from '../entities/dto/personal-representative-right-type.dto'

@Injectable()
export class PersonalRepresentativeRightTypeService {
  constructor(
    @InjectModel(PersonalRepresentativeRightType)
    private personalRepresentativeRightTypeModel: typeof PersonalRepresentativeRightType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all personal repreasentative right types  */
  async getAllAsync(): Promise<PersonalRepresentativeRightType[] | null> {
    return this.personalRepresentativeRightTypeModel.findAll()
  }

  /** Get's all personal repreasentative right types and count */
  async getAndCountAllAsync(
    page: number,
    count: number,
  ): Promise<{
    rows: PersonalRepresentativeRightType[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return await this.personalRepresentativeRightTypeModel.findAndCountAll({
      limit: count,
      offset: offset,
    })
  }

  /** Get's all personal repreasentative right types and count by searchstring */
  async findAsync(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: PersonalRepresentativeRightType[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return await this.personalRepresentativeRightTypeModel.findAndCountAll({
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
    })
  }

  /** Get's a personal repreasentative right type by code */
  async getPersonalRepresentativeRightTypeAsync(
    code: string,
  ): Promise<PersonalRepresentativeRightType | null> {
    this.logger.debug(
      `Finding personal representative right type for code - "${code}"`,
    )

    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    return await this.personalRepresentativeRightTypeModel.findByPk(code)
  }

  /** Create a new personal repreasentative right type */
  async createAsync(
    personalRepresentativeRightType: PersonalRepresentativeRightTypeDTO,
  ): Promise<PersonalRepresentativeRightType> {
    this.logger.debug(
      `Creating personal representative right type with code - "${personalRepresentativeRightType.code}"`,
    )

    return this.personalRepresentativeRightTypeModel.create({
      ...personalRepresentativeRightType,
    })
  }

  /** Updates an existing personal repreasentative right type */
  async updateAsync(
    code: string,
    personalRepresentativeRightType: PersonalRepresentativeRightTypeDTO,
  ): Promise<PersonalRepresentativeRightType | null> {
    this.logger.debug(
      'Updating personalRepresentativeRightType with code ',
      code,
    )

    if (!code) {
      throw new BadRequestException('code must be provided')
    }

    await this.personalRepresentativeRightTypeModel.update(
      { ...personalRepresentativeRightType },
      {
        where: { code: code },
      },
    )

    return await this.personalRepresentativeRightTypeModel.findByPk(
      personalRepresentativeRightType.code,
    )
  }

  /** Soft delete on a personal repreasentative right type by code */
  async deleteAsync(code: string): Promise<number> {
    this.logger.debug(
      'Soft deleting a personal representative right type with name: ',
      code,
    )

    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    const result = await this.personalRepresentativeRightTypeModel.update(
      { validTo: new Date() },
      {
        where: { code: code },
      },
    )

    return result[0]
  }
}
