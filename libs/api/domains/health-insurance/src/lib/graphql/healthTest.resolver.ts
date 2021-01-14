import { Resolver, Query } from '@nestjs/graphql'

import { HealthTest } from './models'
import { HealthTestService } from '../healthTest.service'

@Resolver(() => HealthTest)
export class HealthTestResolver {
  constructor(
    private readonly healthTestService: HealthTestService,
  ) {}

  @Query(() => HealthTest, {
    name: 'healthTest',
    nullable: true,
  })
  getMyFamily(): Promise<HealthTest> {
    return this.healthTestService.getTest('1234567890')
  }
}
