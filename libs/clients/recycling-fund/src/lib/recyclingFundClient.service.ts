import { Inject, Injectable } from '@nestjs/common'
import { print } from 'graphql'

import { User } from '@island.is/auth-nest-tools'
import { RecyclingFundScope } from '@island.is/auth/scopes'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'

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

const baseGqlRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

@Injectable()
export class RecyclingFundClientService {
  private readonly fetch: EnhancedFetchAPI

  constructor(
    @Inject(RecyclingFundClientConfig.KEY)
    private readonly config: ConfigType<typeof RecyclingFundClientConfig>,
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    // ToDo: this should probably be moved to a Provider
    this.fetch = createEnhancedFetch({
      name: 'clients-recycling-fund',
      autoAuth: {
        mode: 'tokenExchange',
        issuer: idsClientConfig.issuer,
        clientId: idsClientConfig.clientId,
        clientSecret: idsClientConfig.clientSecret,
        scope: [RecyclingFundScope.recyclingFund],
      },
    })
  }

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
      // ToDo: Decide how to handle errors
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
    const response = await this.createRecyclingFundRequest(user, {
      query: print(SkilavottordVehicleDocument),
      variables: {
        permno,
      } as SkilavottordVehicleMutationVariables,
    })

    if (!response || !response.ok) {
      // ToDo: Decide how to handle errors
      throw new Error(`Failed to creating vehicle ${user.nationalId}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`Failed to creating vehicle ${permno} - ${data.errors}`)
    }

    return data.createSkilavottordVehicleAppSys
  }

  async recycleVehicle(
    user: User,
    permno: string,
    requestType: RecyclingRequestTypes,
  ) {
    const response = await this.createRecyclingFundRequest(user, {
      query: print(SkilavottordRecyclingRequestDocument),
      variables: {
        permno,
        requestType,
      } as SkilavottordRecyclingRequestMutationVariables,
    })

    if (!response || !response.ok) {
      // ToDo: Decide how to handle errors
      throw new Error(
        `Failed to recycle vehicle ${permno} - RequestType: ${requestType}`,
      )
    }

    return await response.json()
  }
}
