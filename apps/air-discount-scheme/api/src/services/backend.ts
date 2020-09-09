import { Injectable } from '@nestjs/common'
import { RESTDataSource } from 'apollo-datasource-rest'

import { Discount, User, Flight } from '@island.is/air-discount-scheme/types'
import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api/private`

  getUserRelations(nationalId: string): Promise<User[]> {
    return this.get(`users/${nationalId}/relations`)
  }

  getUserFlights(nationalId: string): Promise<Flight[]> {
    return this.get(`users/${nationalId}/flights`)
  }

  getFlights(body: {}): Promise<Flight[]> {
    return this.post('flights', body)
  }

  getDiscount(nationalId: string): Promise<Discount | null> {
    return this.get(`users/${nationalId}/discounts/current`)
  }

  createDiscount(nationalId: string): Promise<Discount> {
    return this.post(`users/${nationalId}/discounts`)
  }
}

export default BackendAPI
