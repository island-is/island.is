import { Injectable } from '@nestjs/common'

import { HealthTest } from './graphql/models'

@Injectable()
export class HealthTestService {
  async getTest(nationalId: string): Promise<HealthTest> {
    const healthTest = new HealthTest()
    healthTest.nationalId = nationalId
    healthTest.fullName = 'working'
    return healthTest
  }
}
