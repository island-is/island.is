import { Inject, Logger } from '@nestjs/common'
import * as kennitala from 'kennitala'

import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'

import { UNKNOWN_NAME } from './constants/names'
import { partitionWithIndex } from './utils/partitionWithIndex'

export type NameInfo = {
  nationalId: string
  name: string
}

export class AliveStatusService {
  constructor(
    private nationalRegistryClient: NationalRegistryClientService,
    private companyRegistryClient: CompanyRegistryClientService,
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
  public async getStatus(nationalIds: string[]): Promise<{
    aliveNationalIds: string[]
    deceasedNationalIds: string[]
    aliveNameInfo: NameInfo[]
  }> {
    if (nationalIds.length === 0) {
      return {
        aliveNationalIds: [],
        deceasedNationalIds: [],
        aliveNameInfo: [],
      }
    }

    const promises = nationalIds.map((nationalId) =>
      kennitala.isCompany(nationalId)
        ? this.companyRegistryClient
            .getCompany(nationalId)
            .catch(this.handlerGetError)
        : this.nationalRegistryClient
            .getIndividual(nationalId)
            .catch(this.handlerGetError),
    )

    try {
      // Check if nationalId is linked to a person, i.e. not deceased
      const identities = await Promise.all(promises)
      const identitiesValuesNoError = identities
        .filter(this.isNotError)
        .filter(isDefined)
        .map((identity) => ({
          nationalId: identity.nationalId,
          name: identity.name ?? UNKNOWN_NAME,
        }))

      // Divide nationalIds into alive or deceased.
      const [aliveNationalIds, deceasedNationalIds] = partitionWithIndex(
        nationalIds,
        (nationalId, index) =>
          // All companies will be divided into alive
          kennitala.isCompany(nationalId) ||
          // Pass through although Þjóðskrá API throws an error
          identities[index] instanceof Error ||
          // Make sure we can match the person to the nationalId, i.e. not deceased
          (identities[index] as IndividualDto)?.nationalId === nationalId,
      )

      return {
        aliveNationalIds,
        deceasedNationalIds,
        aliveNameInfo: identitiesValuesNoError,
      }
    } catch (error) {
      this.logger.error(`Error getting live status.`, error)

      // We do not want to fail the whole request if we cannot get the live status.
      // Therefore, we return all nationalIds as alive.
      return {
        aliveNationalIds: nationalIds,
        deceasedNationalIds: [],
        aliveNameInfo: [],
      }
    }
  }

  private handlerGetError(error: null | Error) {
    return error
  }

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }
}
