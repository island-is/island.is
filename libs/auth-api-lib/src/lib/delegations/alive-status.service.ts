import { Inject, Injectable, Logger } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { UNKNOWN_NAME } from './constants/names'
import { partitionWithIndex } from './utils/partitionWithIndex'

export type NameInfo = {
  nationalId: string
  name: string
}

type IdentityInfo = NameInfo & { isDeceased: boolean }

const decesead = 'LÉST'

@Injectable()
export class AliveStatusService {
  constructor(
    private readonly nationalRegistryClient: NationalRegistryClientService,
    private readonly nationalRegistryV3Client: NationalRegistryV3ClientService,
    private readonly companyRegistryClient: CompanyRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /**
   * Divides nationalIds into alive and deceased
   * - Makes calls for every nationalId to NationalRegistry to check if the person exists.
   * - Divides the nationalIds into alive and deceased, based on
   *   1. All companies will be divided into alive.
   *   2. If the person exists in NationalRegistry, then the person is alive.
   */
  public async getStatus(
    nameInfos: NameInfo[],
    useNationalRegistryV3: boolean,
  ): Promise<{
    aliveNationalIds: string[]
    deceasedNationalIds: string[]
    aliveNameInfo: NameInfo[]
  }> {
    if (nameInfos.length === 0) {
      return {
        aliveNationalIds: [],
        deceasedNationalIds: [],
        aliveNameInfo: [],
      }
    }
    let identitiesValuesNoError: IdentityInfo[] = []
    try {
      const identities = await (
        await Promise.allSettled(
          this.getIdentities(nameInfos, useNationalRegistryV3),
        )
      ).map((promiseResult) =>
        promiseResult.status === 'fulfilled'
          ? promiseResult.value
          : new Error('Error getting identity'),
      )

      identitiesValuesNoError = identities.filter(this.isNotError)

      const deceasedNationalIds = identitiesValuesNoError
        .filter((identity) => identity.isDeceased)
        .map((identity) => identity.nationalId)

      return {
        aliveNationalIds: nameInfos
          .filter((info) => !deceasedNationalIds.includes(info.nationalId))
          .map((info) => info.nationalId),
        deceasedNationalIds: deceasedNationalIds,
        aliveNameInfo: identitiesValuesNoError,
      }
    } catch (error) {
      this.logger.error(`Error getting live status.`, error)

      // We do not want to fail the whole request if we cannot get the live status.
      // Therefore, we return all nationalIds as alive.
      return {
        aliveNationalIds: nameInfos.map((info) => info.nationalId),
        deceasedNationalIds: [],
        aliveNameInfo: identitiesValuesNoError,
      }
    }
  }

  private getIdentities(
    nameInfos: NameInfo[],
    useNationalRegistryV3: boolean,
  ): Promise<IdentityInfo>[] {
    const [companies, individuals] = partitionWithIndex(nameInfos, (nameInfo) =>
      kennitala.isCompany(nameInfo.nationalId),
    )

    const companyPromises = companies.map((nameInfo) =>
      this.getCompanyIdentity(nameInfo),
    )

    const individualPromises = individuals.map((nameInfo) =>
      this.getIndividualIdentity(nameInfo, useNationalRegistryV3),
    )

    return [...companyPromises, ...individualPromises]
  }

  private getCompanyIdentity(companyInfo: NameInfo): Promise<IdentityInfo> {
    // All companies will be divided into alive
    return this.companyRegistryClient
      .getCompany(companyInfo.nationalId)
      .then((company) => {
        if (company && this.isNotError(company)) {
          return {
            nationalId: company.nationalId,
            name: company.name,
            isDeceased: false,
          }
        } else {
          return {
            nationalId: companyInfo.nationalId,
            name: companyInfo.name ?? UNKNOWN_NAME,
            isDeceased: false,
          }
        }
      })
  }

  private async getIndividualIdentity(
    individualInfo: NameInfo,
    useNationalRegistryV3: boolean,
  ): Promise<IdentityInfo> {
    if (useNationalRegistryV3) {
      return await this.nationalRegistryV3Client
        .getAllDataIndividual(individualInfo.nationalId)
        .then((individual) => {
          if (
            individual &&
            this.isNotError(individual) &&
            individual?.kennitala &&
            individual?.kennitala !== null
          ) {
            return {
              nationalId: individual.kennitala,
              name: individual.nafn ?? individualInfo.name ?? UNKNOWN_NAME,
              isDeceased: individual.afdrif === decesead,
            }
          } else {
            // Pass through although Þjóðskrá API throws an error
            return {
              nationalId: individualInfo.nationalId,
              name: individualInfo.name ?? UNKNOWN_NAME,
              isDeceased: false,
            }
          }
        })
    } else {
      return await this.getIndividualIdentityV2(individualInfo)
    }
  }

  private getIndividualIdentityV2(
    individualInfo: NameInfo,
  ): Promise<IdentityInfo> {
    return this.nationalRegistryClient
      .getIndividual(individualInfo.nationalId)
      .then((individual) => {
        if (individual === null) {
          return {
            nationalId: individualInfo.nationalId,
            name: individualInfo.name ?? UNKNOWN_NAME,
            isDeceased: true,
          }
        } else {
          return {
            nationalId: individual?.nationalId ?? individualInfo.nationalId,
            name: individual?.name ?? individualInfo.name ?? UNKNOWN_NAME,
            isDeceased: false,
          }
        }
      })
  }

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }
}
