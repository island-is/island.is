import { Inject, Injectable } from '@nestjs/common'
import { print } from 'graphql'

import { User } from '@island.is/auth-nest-tools'
import { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import {
  CreateRequestDocument,
  CreateRequestMutation,
  CreateRequestMutationVariables,
  SkilavottordRecyclingRequestDocument,
  SkilavottordRecyclingRequestMutationVariables,
  SkilavottordVehicleDocument,
  SkilavottordVehicleMutationVariables,
  SkilavottordVehicleOwnerDocument,
  SkilavottordVehicleOwnerMutationVariables,
} from './createRecyclingRequest.generated'

import { RecyclingRequestTypes } from '../../gen/schema'
import { RecyclingFundClientConfig } from './recyclingFundClient.config'
import { RecyclingFundFetchKey } from './recyclingFundFetchProvider'

const baseGqlRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

@Injectable()
export class RecyclingFundClientService {
  constructor(
    @Inject(RecyclingFundClientConfig.KEY)
    private readonly config: ConfigType<typeof RecyclingFundClientConfig>,
    @Inject(RecyclingFundFetchKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  async createRecyclingFundRequest(user: User, body: any) {
    return await this.fetch(this.config.gqlBasePath, {
      ...baseGqlRequestOptions,
      auth: user,
      body: JSON.stringify(body),
    })
  }

  async createRecyclingRequest(user: User) {
    // This could be abstratcted into a more generic fetch method with types
    const response = await this.fetch(this.config.gqlBasePath, {
      ...baseGqlRequestOptions,
      auth: user,
      body: JSON.stringify({
        query: print(CreateRequestDocument),
        variables: {
          input: {
            permno: 'THS45',
            requestType: RecyclingRequestTypes.pendingRecycle,
          },
        } as CreateRequestMutationVariables,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to creating recycling request from`)
    }

    const data = (await response.json()) as CreateRequestMutation

    console.log('response from createRecyclingRequest GQL', {
      status: response.status,
      data,
    })

    return data.createRecyclingRequestAppSys.status
  }

  async createOwner(user: User, applicantName: string) {
    const response = await this.createRecyclingFundRequest(user, {
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
      const response = await this.createRecyclingFundRequest(user, {
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
    const response = await this.createRecyclingFundRequest(user, {
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
