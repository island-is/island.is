import { Inject, Injectable } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import {
  AirDiscountSchemeOptions,
  AIR_DISCOUNT_SCHEME_OPTIONS,
  Discount,
  User,
} from '@island.is/air-discount-scheme/types'

@Injectable()
class BackendAPI extends RESTDataSource {
  constructor(
    @Inject(AIR_DISCOUNT_SCHEME_OPTIONS)
    private readonly options: AirDiscountSchemeOptions,
  ) {
    super()
    this.initialize({} as DataSourceConfig<void>)
    this.baseURL = `${this.options.backendUrl}/api/`
  }

  willSendRequest(_request: RequestOptions) {
    this.memoizedResults.clear()
  }

  getDiscount(
    nationalId: string,
    authorization: string,
  ): Promise<Discount | null> {
    return this.get(
      `private/users/${nationalId}/discounts/current`,
      undefined,
      { headers: { authorization } },
    )
  }

  getUserRelations(nationalId: string, authorization: string): Promise<User[]> {
    return this.get(`private/users/${nationalId}/relations`, undefined, {
      headers: { authorization },
    })
  }

  createDiscount(nationalId: string, authorization: string): Promise<Discount> {
    return this.post(`private/users/${nationalId}/discounts`, undefined, {
      headers: { authorization },
    })
  }
}

export default BackendAPI
