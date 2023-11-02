import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { randomInt } from 'crypto'
import CryptoJS from 'crypto-js'
import Base64 from 'crypto-js/enc-base64'
import sha256 from 'crypto-js/sha256'
import { uuid } from 'uuidv4'

import { Client, ClientSecret } from '@island.is/auth-api-lib'
import { NoContentException } from '@island.is/nest/problem'

import { environment } from '../../../environments'
import { ClientSecretDto } from './dto/client-secret.dto'

const secretType = 'SharedSecret'

@Injectable()
export class ClientSecretsService {
  private encryptionKey: string

  constructor(
    @InjectModel(ClientSecret)
    private clientSecretModel: typeof ClientSecret,
    @InjectModel(Client)
    private clientModel: typeof Client,
  ) {
    if (environment.clientSecretEncryptionKey === undefined) {
      throw new Error('Client secret encryption key is not defined')
    }

    this.encryptionKey = environment.clientSecretEncryptionKey
  }

  async findAll(
    tenantId: string,
    clientId: string,
  ): Promise<ClientSecretDto[]> {
    const secrets = await this.clientSecretModel.findAll({
      where: {
        clientId,
        type: secretType,
      },
      include: [
        {
          model: Client,
          where: { domainName: tenantId },
          required: true,
          attributes: [],
        },
      ],
      // The secret considered active is the one with the latest created date if there are two or more of the new version (contain encrypted value)
      order: [['created', 'DESC']],
    })

    return secrets.map((secret) => this.formatSecret(secret))
  }

  async create(tenantId: string, clientId: string): Promise<ClientSecretDto> {
    if (!(await this.belongsToTenant(clientId, tenantId))) {
      throw new NoContentException()
    }

    const decryptedValue = this.generateSecret()
    const hash = Base64.stringify(sha256(decryptedValue))
    const encryptedValue = CryptoJS.AES.encrypt(
      decryptedValue,
      this.encryptionKey,
      { iv: CryptoJS.enc.Hex.parse(uuid()) },
    ).toString()

    const createdSecret = await this.clientSecretModel.create({
      clientId: clientId,
      value: hash,
      encryptedValue: encryptedValue,
      type: secretType,
    })

    return this.formatSecret(createdSecret)
  }

  async delete(
    tenantId: string,
    clientId: string,
    secretId: string,
  ): Promise<number> {
    if (!(await this.belongsToTenant(clientId, tenantId)) || !secretId) {
      throw new NoContentException()
    }

    return this.clientSecretModel.destroy({
      where: {
        clientId,
        id: secretId,
      },
    })
  }

  private async belongsToTenant(clientId: string, tenantId: string) {
    const client = await this.clientModel.findOne({
      useMaster: true,
      where: {
        clientId,
        domainName: tenantId,
      },
      attributes: ['clientId'],
    })
    return Boolean(client)
  }

  private formatSecret(secret: ClientSecret): ClientSecretDto {
    const decryptedValue = secret.encryptedValue
      ? CryptoJS.AES.decrypt(
          secret.encryptedValue,
          this.encryptionKey,
        ).toString(CryptoJS.enc.Utf8)
      : undefined

    return {
      secretId: secret.id,
      clientId: secret.clientId,
      decryptedValue: decryptedValue,
    }
  }

  private generateSecret() {
    let generatedSecret = ''

    const length = randomInt(20, 30)

    const validChars =
      '0123456789' +
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '.-+!#$%'

    for (let i = 0; i < length; i++) {
      generatedSecret += validChars[randomInt(0, validChars.length)]
    }

    return generatedSecret
  }
}
