import { Injectable } from '@nestjs/common'
import { RESTDataSource } from 'apollo-datasource-rest'

import { Discount } from '@island.is/air-discount-scheme/types'
import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backendUrl}/api/private`

  async getDiscount(nationalId: string): Promise<Discount | null> {
    const discounts = await this.get(`users/${nationalId}/discounts`)
    if (discounts.length > 0) {
      return discounts[0]
    }
    return null
  }

  createDiscount(nationalId: string): Promise<Discount> {
    return this.post(`users/${nationalId}/discounts`)
  }
}

export default BackendAPI
