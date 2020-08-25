import { Injectable } from '@nestjs/common'
import { RESTDataSource } from 'apollo-datasource-rest'

import { Discount } from '@island.is/air-discount-scheme/types'
import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api/private`

  getDiscounts(nationalId: string): Promise<Discount | null> {
    return this.get(`users/${nationalId}/discounts`)
  }

  createDiscount(nationalId: string): Promise<Discount> {
    return this.post(`users/${nationalId}/discounts`)
  }
}

export default BackendAPI
