import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import Soap from 'soap'

import type { User } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import {
  GetViewISLFjolskyldanDto,
  GetViewISLEinstaklingurDto,
  ISLFjolskyldan,
  ISLEinstaklingur,
} from './dto'
import { SoapClient } from './soapClient'

export interface NationalRegistryConfig {
  baseSoapUrl: string
  host: string
  user: string
  password: string
}

export class NationalRegistryApi {
  private readonly client: Soap.Client | null
  private readonly clientUser: string
  private readonly clientPassword: string

  static async instanciateClass(config: NationalRegistryConfig) {
    return new NationalRegistryApi(
      await SoapClient.generateClient(config.baseSoapUrl, config.host),
      config.password,
      config.user,
    )
  }

  constructor(
    private soapClient: Soap.Client | null,
    clientPassword: string,
    clientUser: string,
  ) {
    if (!soapClient) {
      logger.error('NationalRegistry Soap client not initialized')
    }
    if (!clientUser) {
      logger.error('NationalRegistry user not provided')
    }
    if (!clientPassword) {
      logger.error('NationalRegistry password not provided')
    }

    this.client = soapClient
    this.clientUser = clientUser
    this.clientPassword = clientPassword
  }

  public async getUser(
    nationalId: User['nationalId'],
  ): Promise<ISLEinstaklingur> {
    const response: GetViewISLEinstaklingurDto = await this.signal(
      'GetViewISLEinstaklingur',
      {
        Kennitala: nationalId,
      },
    )

    if (!response) {
      throw new NotFoundException(
        `user with nationalId ${nationalId} not found in national Registry`,
      )
    }
    return response.table.diffgram.DocumentElement.ISLEinstaklingur
  }

  public async getMyFamily(nationalId: string): Promise<ISLFjolskyldan[]> {
    const response: GetViewISLFjolskyldanDto = await this.signal(
      'GetViewISLFjolskyldan',
      {
        Kennitala: nationalId,
      },
    )

    if (!response) {
      throw new NotFoundException(
        `family for nationalId ${nationalId} not found`,
      )
    }
    return Array.isArray(response.table.diffgram.DocumentElement.ISLFjolskyldan)
      ? response.table.diffgram.DocumentElement.ISLFjolskyldan
      : [response.table.diffgram.DocumentElement.ISLFjolskyldan]
  }

  private async signal(
    functionName: string,
    args: Record<string, string>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        throw new InternalServerErrorException('Client not initialized')
      }

      this.client[functionName](
        {
          ':SortColumn': 1,
          ':SortAscending': true,
          ':S5Username': this.clientUser,
          ':S5Password': this.clientPassword,
          ...Object.keys(args).reduce(
            (acc: Record<string, string>, key: string) => ({
              ...acc,
              [`:${key}`]: args[key],
            }),
            {},
          ),
        },
        (
          // eslint-disable-next-line
          error: any,
          response: any,
        ) => {
          const result = response[`${functionName}Result`]
          if (result != null) {
            if (!result.success) {
              logger.error(result.message)
              reject(result)
            }
            if (error) {
              logger.error(error)
              reject(error)
            }
            resolve(result.table.diffgram ? result : null)
          }
          resolve(null)
        },
      )
    })
  }
}
