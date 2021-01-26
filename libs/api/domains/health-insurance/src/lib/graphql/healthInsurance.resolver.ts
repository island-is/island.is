import { Resolver, Query, Args } from '@nestjs/graphql'

import { HealthTest } from './models'
import { HealthInsuranceService } from '../healthInsurance.service'

@Resolver(() => HealthTest)
export class HealthInsuranceResolver {
  constructor(
    private readonly healthInsuranceService: HealthInsuranceService,
  ) {}

  @Query(() => HealthTest, {
    name: 'healthTest',
    nullable: true,
  })
  healthTest(): Promise<HealthTest> {
    return this.healthInsuranceService.getTest('1234567890')
  }

  @Query(() => String, {
    name: 'healthInsuranceGetProfun',
  })
  healthInsuranceGetProfun(): Promise<string> {
    return this.healthInsuranceService.getProfun()
  }

  @Query(() => String, {
    name: 'healthInsuranceIsHealthInsured',
  })
  healthInsuranceIsHealthInsured(
    @Args('nationalId') nationalId: string,
  ): Promise<boolean> {
    return this.healthInsuranceService.isHealthInsured(nationalId)
  }
}
