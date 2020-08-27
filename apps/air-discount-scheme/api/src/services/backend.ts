import { Injectable } from '@nestjs/common'
import { RESTDataSource } from 'apollo-datasource-rest'

import {
  Discount,
  FlightLegFund,
  ThjodskraUser,
} from '@island.is/air-discount-scheme/types'
import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api/private`

  getUserRelations(nationalId: string): Promise<ThjodskraUser[]> {
    return this.get(`users/${nationalId}/relations`)
  }

  getFlightLegFunds(nationalId: string): Promise<FlightLegFund> {
    return this.get(`users/${nationalId}/flights/funds`)
  }

  getDiscount(nationalId: string): Promise<Discount | null> {
    return this.get(`users/${nationalId}/discounts/current`)
  }

  createDiscount(nationalId: string): Promise<Discount> {
    return this.post(`users/${nationalId}/discounts`)
  }
}

export default BackendAPI
