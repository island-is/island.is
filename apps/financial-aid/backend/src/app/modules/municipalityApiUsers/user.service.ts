import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiUserModel } from './user.model'
import { Op } from 'sequelize'
import { CreateApiKeyDto } from './dto'
import { stringify } from 'querystring'

@Injectable()
export class ApiUserService {
  constructor(
    @InjectModel(ApiUserModel)
    private readonly apiUserModel: typeof ApiUserModel,
  ) {}

  async findByApiKey(apiKey: string): Promise<ApiUserModel> {
    return await this.apiUserModel.findOne({
      where: {
        apiKey,
      },
    })
  }

  async findByMunicipalityCode(
    municipalityCodes: string[],
  ): Promise<ApiUserModel[]> {
    return await this.apiUserModel.findAll({
      where: {
        municipalityCode: {
          [Op.in]: municipalityCodes,
        },
      },
    })
  }

  async create(input: CreateApiKeyDto): Promise<ApiUserModel> {
    return await this.apiUserModel.create(input)
  }

  async updateApiKey(id: string, name: string): Promise<ApiUserModel> {
    const [numberOfAffectedRows, [updatedApiKey]] =
      await this.apiUserModel.update(
        { name },
        {
          where: { id },
          returning: true,
        },
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Api key ${id} does not exist`)
    }

    return updatedApiKey
  }
}
