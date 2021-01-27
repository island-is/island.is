import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

import { HealthTest } from './models'
import { HealthInsuranceService } from '../healthInsurance.service'

@UseGuards(IdsAuthGuard, ScopesGuard) // TODO: enable when go to dev/prod
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
    @CurrentUser() user: AuthUser,
  ): Promise<boolean> {
    return this.healthInsuranceService.isHealthInsured(user.nationalId)
    // return this.healthInsuranceService.isHealthInsured('0101006070') // TODO cleanup
  }

  @Query(() => [Number], {
    name: 'healthInsuranceGetApplication',
  })
  healthInsuranceGetPendingApplication(
    @CurrentUser() user: AuthUser,
  ): Promise<number[]> {
    return this.healthInsuranceService.getPendingApplication(user.nationalId)
    // return this.healthInsuranceService.getPendingApplication('0101006070') // TODO cleanup
  }
}
