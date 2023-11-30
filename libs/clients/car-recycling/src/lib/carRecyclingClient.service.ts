import { Inject, Injectable } from '@nestjs/common'
import { print } from 'graphql'

import { User } from '@island.is/auth-nest-tools'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import {
  SkilavottordRecyclingRequestDocument,
  SkilavottordRecyclingRequestMutationVariables,
  SkilavottordVehicleDocument,
  SkilavottordVehicleMutationVariables,
  SkilavottordVehicleOwnerDocument,
  SkilavottordVehicleOwnerMutationVariables,
} from './createRecyclingRequest.generated'

import { RecyclingRequestTypes } from '../../gen/schema'
import { CarRecyclingClientConfig } from './carRecyclingClient.config'
import { CarRecyclingFetchProviderKey } from './carRecyclingFetchProvider'

const baseGqlRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

interface RequestBody {
  query: string
  variables: {
    input: object
  }
}

@Injectable()
export class CarRecyclingClientService {
  constructor(
    @Inject(CarRecyclingClientConfig.KEY)
    private readonly config: ConfigType<typeof CarRecyclingClientConfig>,
    @Inject(CarRecyclingFetchProviderKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  async gqlRequestWithAuth(user: User, body: RequestBody) {
    return await this.fetch(this.config.gqlBasePath, {
      ...baseGqlRequestOptions,
      auth: user,
      body: JSON.stringify(body),
    })
  }

  async createOwner(user: User, applicantName: string) {
    const response = await this.gqlRequestWithAuth(user, {
      query: print(SkilavottordVehicleOwnerDocument),
      variables: {
        input: {
          name: applicantName,
        },
      } as SkilavottordVehicleOwnerMutationVariables,
    })

    if (!response || !response.ok) {
      throw new Error(`Failed to creating owner ${user.nationalId}`)
    }

    return await response.json()
  }

  async createVehicle(user: User, permno: string) {
    try {
      const response = await this.gqlRequestWithAuth(user, {
        query: print(SkilavottordVehicleDocument),
        variables: {
          input: {
            permno,
          },
        } as SkilavottordVehicleMutationVariables,
      })

      if (!response || !response.ok) {
        throw new Error(`Failed to creating vehicle ${permno}`)
      }

      return await response.json()
    } catch (e) {
      throw new Error(`Failed to creating vehicle ${permno}`)
    }
  }

  async recycleVehicle(
    user: User,
    permno: string,
    requestType: RecyclingRequestTypes,
  ) {
    const response = await this.gqlRequestWithAuth(user, {
      query: print(SkilavottordRecyclingRequestDocument),
      variables: {
        input: {
          permno,
          requestType,
        },
      } as SkilavottordRecyclingRequestMutationVariables,
    })

    if (!response || !response.ok) {
      throw new Error(
        `Failed to recycle vehicle ${permno} - RequestType: ${requestType}`,
      )
    }

    return await response.json()
  }
}
