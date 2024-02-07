import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import CryptoJS from 'crypto-js'
import { ApiUserModel } from './user.model'
import { Op } from 'sequelize'
import { CreateApiKeyDto } from './dto'
import { environment } from '../../../environments'
import { uuid } from 'uuidv4'

@Injectable()
export class ApiUserService {
  constructor(
    @InjectModel(ApiUserModel)
    private readonly apiUserModel: typeof ApiUserModel,
  ) {}

  async findByMunicipalityCodeAndApiKey(
    apiKey: string,
    municipalityCode: string,
  ): Promise<ApiUserModel> {
    const keysWithMunicipalityCode = await this.apiUserModel.findAll({
      where: {
        municipalityCode,
      },
    })

    return keysWithMunicipalityCode.find(
      (m) => this.decryptApiKey(m).apiKey === apiKey,
    )
  }

  async findByMunicipalityCode(
    municipalityCodes: string[],
  ): Promise<ApiUserModel[]> {
    return (
      await this.apiUserModel.findAll({
        where: {
          municipalityCode: {
            [Op.in]: municipalityCodes,
          },
        },
      })
    ).map((m) => this.decryptApiKey(m))
  }

  async create(input: CreateApiKeyDto): Promise<ApiUserModel> {
    const cryptedApiKey = CryptoJS.AES.encrypt(
      input.apiKey,
      environment.municipalityAccessApiEncryptionKey,
      { iv: CryptoJS.enc.Hex.parse(uuid()) },
    ).toString()

    const apiUserModel = await this.apiUserModel.create({
      ...input,
      apiKey: cryptedApiKey,
    })

    return this.decryptApiKey(apiUserModel)
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

    return this.decryptApiKey(updatedApiKey)
  }

  decryptApiKey(apiKeyInfo?: ApiUserModel) {
    if (apiKeyInfo?.apiKey) {
      apiKeyInfo.apiKey = CryptoJS.AES.decrypt(
        apiKeyInfo.apiKey,
        environment.municipalityAccessApiEncryptionKey,
      ).toString(CryptoJS.enc.Utf8)
    }
    return apiKeyInfo
  }
}
