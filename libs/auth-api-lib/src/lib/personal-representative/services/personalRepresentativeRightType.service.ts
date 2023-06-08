import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'
import { PersonalRepresentativeRightType } from '../models/personal-representative-right-type.model'
import { PersonalRepresentativeRightTypeDTO } from '../dto/personal-representative-right-type.dto'
import { paginate, PaginationDto } from '@island.is/nest/pagination'
import { PaginatedPersonalRepresentativeRightTypeDto } from '../dto/paginated-personal-representative-right-type.dto'

@Injectable()
export class PersonalRepresentativeRightTypeService {
  constructor(
    @InjectModel(PersonalRepresentativeRightType)
    private personalRepresentativeRightTypeModel: typeof PersonalRepresentativeRightType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all personal repreasentative right types  */
  async getMany(
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    return paginate({
      Model: this.personalRepresentativeRightTypeModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'code',
      orderOption: [['code', 'ASC']],
      where: {},
    })
  }

  /** Get's all personal repreasentative right types and count by searchstring */
  async findMany(
    searchString: string,
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    return paginate({
      Model: this.personalRepresentativeRightTypeModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'code',
      orderOption: [['code', 'ASC']],
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
  async getPersonalRepresentativeRightType(
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
  async create(
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
  async update(
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
    if (code !== personalRepresentativeRightType.code) {
      throw new BadRequestException('data descreptancy')
    }
    const currentData =
      await this.personalRepresentativeRightTypeModel.findByPk(code)
    if (!currentData) {
      throw new NotFoundException()
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
  async delete(code: string): Promise<number> {
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
