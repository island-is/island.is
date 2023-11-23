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

  async createOwner(user: User) {
    /*const sdk = this.getSdk(user)
 console.log('createOwner', user)

    return sdk.skilavottordVehicleOwnerMutation({
      name: user.nationalId || '',
    })*/
  }

  async createVehicle(user: User, permno: string) {
    console.log('createVehicle', permno)
    /*const sdk = this.getSdk(user)

    

    return sdk.skilavottordVehicleMutation({
      permno,
    })*/
  }

  async recycleVehicle(
    user: User,
    permno: string,
    requestType: RecyclingRequestTypes,
  ) {
    console.log('recycleVehicle', permno, requestType)
    /* const sdk = this.getSdk(user)
    return sdk.skilavottordRecyclingRequestMutation({
      permno,
      requestType,
    })*/
  }
}
