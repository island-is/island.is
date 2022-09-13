import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import Soap from 'soap'

import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import type { User } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import {
  GetViewISLFjolskyldanDto,
  GetViewISLEinstaklingurDto,
  GetViewISLBorninMinDto,
  ISLFjolskyldan,
  ISLBorninMin,
  ISLEinstaklingur,
  FamilyCorrection,
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

  /**
   * This caused a GQL api server crash when the WSDL request was hanging due to
   * Þjóðskrá loosing electricity and their services went down.
   * To prevent this causing a restart loop in our kubernetes environment we have
   * added a http request timeout of 10 sec.
   */
  static async instantiateClass(config: NationalRegistryConfig) {
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

    this.client = this.soapClient
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

  public async getMyChildren(nationalId: string): Promise<ISLBorninMin[]> {
    const borninMinResponse: GetViewISLBorninMinDto = await this.signal(
      'GetViewISLBorninMin',
      {
        Kennitala: nationalId,
      },
    )

    if (isObject(borninMinResponse) && isEmpty(borninMinResponse)) {
      /**
       * User with no children will recieve an empty object
       * Returning an empty array instead.
       */
      return []
    }

    if (!borninMinResponse) {
      throw new NotFoundException(
        `children for nationalId ${nationalId} not found`,
      )
    }

    const documentData =
      borninMinResponse?.table?.diffgram?.DocumentElement?.ISLBorninMin
    return Array.isArray(documentData) ? documentData : [documentData]
  }

  public async postUserCorrection(
    values: FamilyCorrection,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await this.signal(
      'CreateAndUpdateMS_Leidretting',
      {
        S5RequestID: '',
        Kennitala: values.nationalId,
        Barn: values.nationalIdChild,
        Nafn: values.name,
        Simanumer: values.phonenumber,
        Netfang: values.email,
        Athugasemd: values.comment,
        Stada: 'Skráð',
      },
      true,
    )

    if (!response) {
      throw new InternalServerErrorException(
        'User correction not sent. Unknown error',
      )
    }
    return {
      success: response?.success,
      message: response?.message,
    }
  }

  private async signal(
    functionName: string,
    args: Record<string, string>,
    post?: boolean,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        throw new InternalServerErrorException('Client not initialized')
      }

      const formatData = Object.keys(args).reduce(
        (acc: Record<string, string>, key: string) => ({
          ...acc,
          [`:${key}`]: args[key],
        }),
        {},
      )

      const formattedData = post
        ? {
            ':S5Username': this.clientUser,
            ':S5Password': this.clientPassword,
            ':values': formatData,
          }
        : {
            ':SortColumn': 1,
            ':SortAscending': true,
            ':S5Username': this.clientUser,
            ':S5Password': this.clientPassword,
            ...formatData,
          }

      this.client[functionName](
        formattedData,
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
            if (post) {
              resolve(result ? result : null)
            } else {
              resolve(result.table.diffgram ? result : null)
            }
          }
          resolve(null)
        },
      )
    })
  }
}
