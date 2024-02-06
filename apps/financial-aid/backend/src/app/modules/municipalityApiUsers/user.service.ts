import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import CryptoJS from 'crypto-js'
import { ApiUserModel } from './models/user.model'
import { Op } from 'sequelize'
import { CreateApiKeyDto } from './dto'
import { environment } from '../../../environments'
import { uuid } from 'uuidv4'
import { DeleteApiKeyResponse } from './models/deleteFile.response'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ApiUserService {
  constructor(
    @InjectModel(ApiUserModel)
    private readonly apiUserModel: typeof ApiUserModel,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByApiKey(apiKey: string): Promise<ApiUserModel> {
    return this.decryptApiKey(
      await this.apiUserModel.findOne({
        where: {
          apiKey,
        },
      }),
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

  async delete(id: string): Promise<DeleteApiKeyResponse> {
    const promisedUpdate = this.apiUserModel.destroy({
      where: {
        id,
      },
    })

    const numberOfAffectedRows = await promisedUpdate

    if (numberOfAffectedRows !== 1) {
      // Tolerate failure, but log error
      throw new NotFoundException(`Api key ${id} does not exist`)
    }

    return { success: numberOfAffectedRows === 1 }
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
