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
import { PersonalRepresentativeType } from '../models/personal-representative-type.model'
import { PersonalRepresentativeTypeDTO } from '../dto/personal-representative-type.dto'
import { PaginatedPersonalRepresentativeTypeDto } from '../dto/paginated-personal-representative-type.dto'

import { paginate, PaginationDto } from '@island.is/nest/pagination'

@Injectable()
export class PersonalRepresentativeTypeService {
  constructor(
    @InjectModel(PersonalRepresentativeType)
    private personalRepresentativeTypeModel: typeof PersonalRepresentativeType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all personal repreasentative types  */
  async getMany(
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeTypeDto> {
    return paginate({
      Model: this.personalRepresentativeTypeModel,
      limit: query.limit || 10,
      after: query.after ?? '',
      before: query.before ?? '',
      primaryKeyField: 'code',
      orderOption: [['code', 'ASC']],
      where: {},
    })
  }

  /** Get's all personal repreasentative types and count by searchstring */
  async findMany(
    searchString: string,
    query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeTypeDto> {
    return paginate({
      Model: this.personalRepresentativeTypeModel,
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

  /** Get's a personal repreasentative type by code */
  async getPersonalRepresentativeType(
    code: string,
  ): Promise<PersonalRepresentativeType | null> {
    this.logger.debug(
      `Finding personal representative type for code - "${code}"`,
    )

    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    return this.personalRepresentativeTypeModel.findByPk(code)
  }

  /** Create a new personal repreasentative type */
  async create(
    personalRepresentativeType: PersonalRepresentativeTypeDTO,
  ): Promise<PersonalRepresentativeType> {
    this.logger.debug(
      `Creating personal representative type with code - "${personalRepresentativeType.code}"`,
    )

    return this.personalRepresentativeTypeModel.create({
      ...personalRepresentativeType,
    })
  }

  /** Updates an existing personal repreasentative type */
  async update(
    code: string,
    personalRepresentativeType: PersonalRepresentativeTypeDTO,
  ): Promise<PersonalRepresentativeType | null> {
    this.logger.debug('Updating personalRepresentativeType with code ', code)

    if (!code) {
      throw new BadRequestException('code must be provided')
    }
    if (code !== personalRepresentativeType.code) {
      throw new BadRequestException('data descreptancy')
    }
    const currentData = await this.personalRepresentativeTypeModel.findByPk(
      code,
    )
    if (!currentData) {
      throw new NotFoundException()
    }

    await this.personalRepresentativeTypeModel.update(
      { ...personalRepresentativeType },
      {
        where: { code: code },
      },
    )

    return this.personalRepresentativeTypeModel.findByPk(
      personalRepresentativeType.code,
    )
  }

  /** Soft delete on a personal repreasentative type by code */
  async delete(code: string): Promise<number> {
    this.logger.debug(
      'Soft deleting a personal representative type with code: ',
      code,
    )

    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    const result = await this.personalRepresentativeTypeModel.update(
      { validTo: new Date() },
      {
        where: { code: code },
      },
    )

    return result[0]
  }
}
