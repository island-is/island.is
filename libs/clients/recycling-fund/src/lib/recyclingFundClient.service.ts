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
  SkilavottordRecyclingRequestMutation,
  SkilavottordRecyclingRequestMutationVariables,
  SkilavottordVehicleDocument,
  SkilavottordVehicleMutation,
  SkilavottordVehicleMutationVariables,
  SkilavottordVehicleOwnerDocument,
  SkilavottordVehicleOwnerMutation,
  SkilavottordVehicleOwnerMutationVariables,
} from './createRecyclingRequest.generated'

import { RecyclingFundClientConfig } from './recyclingFundClient.config'
import { RecyclingRequestTypes } from '../../gen/schema'

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

    console.log('Response', response)

    if (!response.ok) {
      // ToDo: Decide how to handle errors
      throw new Error(`Failed to creating owner ${user.nationalId}`)
    }

    const data = (await response.json()) as SkilavottordVehicleOwnerMutation

    console.log('response from createRecyclingRequest GQLs', {
      data,
    })

    return data.createSkilavottordVehicleOwnerAppSys
  }

  async createVehicle(user: User, permno: string) {
    console.log('createVehicle', permno)

    const response = await this.createRecyclingFundRequest(user, {
      query: print(SkilavottordVehicleDocument),
      variables: {
        permno,
      } as SkilavottordVehicleMutationVariables,
    })

    if (!response.ok) {
      // ToDo: Decide how to handle errors
      throw new Error(`Failed to creating vehicle ${user.nationalId}`)
    }

    const data = (await response.json()) as SkilavottordVehicleMutation

    console.log('createVehicle-data', data)

    return data.createSkilavottordVehicleAppSys
  }

  async recycleVehicle(
    user: User,
    permno: string,
    requestType: RecyclingRequestTypes,
  ) {
    console.log('recycleVehicle', permno, requestType)

    const response = await this.createRecyclingFundRequest(user, {
      query: print(SkilavottordRecyclingRequestDocument),
      variables: {
        permno,
        requestType,
      } as SkilavottordRecyclingRequestMutationVariables,
    })

    if (!response.ok) {
      // ToDo: Decide how to handle errors
      throw new Error(`Failed to creating vehicle ${user.nationalId}`)
    }

    const data = (await response.json()) as SkilavottordRecyclingRequestMutation

    console.log('createVehicle-data', data)

    return data.createSkilavottordRecyclingRequestAppSys
  }
}
