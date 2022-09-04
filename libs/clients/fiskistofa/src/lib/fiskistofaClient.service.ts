import { Inject, Injectable } from '@nestjs/common'
import {
  GetShipStatusInformationInput,
  GetUpdatedShipStatusInformationInput,
} from '@island.is/api/domains/fiskistofa'
import {
  Configuration,
  StadaSkipsApi,
  V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
} from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch, FetchError } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import {
  mapAllowedCatchForShip,
  mapChangedAllowedCatchForShip,
} from './fiskistofaClient.utils'

@Injectable()
export class FiskistofaClientService {
  private api: StadaSkipsApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  private async createApi(ignoreCache: boolean = false) {
    if (this.api && !ignoreCache) {
      return this.api
    }

    const api = new StadaSkipsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const accessTokenResponse = await fetch(
      this.clientConfig.accessTokenServiceUrl,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientConfig.accessTokenServiceClientId,
          client_secret: this.clientConfig.accessTokenServiceClientSecret,
          audience: this.clientConfig.accessTokenServiceAudience,
        }),
      },
    )

    const { access_token } = await accessTokenResponse.json()

    if (!access_token) {
      throw new Error('Fiskistofa client configuration and login went wrong')
    }

    this.api = api.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )

    return this.api
  }

  private async fetchWithTokenRefresh(
    params: Record<string, any>,
    fetchFunction: (api: StadaSkipsApi, params: any) => any,
  ) {
    const api = await this.createApi()
    try {
      return fetchFunction(api, params)
    } catch (error) {
      if (error instanceof FetchError) {
        const tokenExpired = error.status === 401
        if (tokenExpired) {
          const apiWithUpdatedToken = await this.createApi(true)
          return fetchFunction(apiWithUpdatedToken, params)
        }
      }
      throw error
    }
  }

  async getUpdatedShipStatusInformation(
    input: GetUpdatedShipStatusInformationInput,
  ) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
      aflamarkSkipsBreytingarDTO: {
        breytingarFisktegundar: input.changes.categoryChanges.map(
          ({ catchChange, allowedCatchChange, id }) => ({
            aflabreyting: catchChange,
            aflamarksbreyting: allowedCatchChange,
            kvotategund: id,
          }),
        ),
      },
    }
    return this.fetchWithTokenRefresh(
      params,
      this.getUpdatedShipStatusInformationInternal,
    )
  }

  private async getUpdatedShipStatusInformationInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerFiskveidiarTimabilBreyttPostRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerFiskveidiarTimabilBreyttPost(
      params,
    )
    return mapChangedAllowedCatchForShip(response)
  }

  async getShipStatusInformation(input: GetShipStatusInformationInput) {
    const params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest = {
      skipnumer: input.shipNumber,
      timabil: input.timePeriod,
    }
    return this.fetchWithTokenRefresh(
      params,
      this.getShipStatusInformationInternal,
    )
  }

  private async getShipStatusInformationInternal(
    api: StadaSkipsApi,
    params: V1StadaskipsSkipnumerFiskveidiarTimabilGetRequest,
  ) {
    const response = await api.v1StadaskipsSkipnumerFiskveidiarTimabilGet(
      params,
    )
    return mapAllowedCatchForShip(response)
  }
}
