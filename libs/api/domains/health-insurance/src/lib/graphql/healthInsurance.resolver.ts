import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

import { HealthTest } from './models'
import { HealthInsuranceService } from '../healthInsurance.service'
import { BucketService } from './bucket.service'

// @UseGuards(IdsAuthGuard, ScopesGuard) // TODO: enable when go to dev/prod
@Resolver(() => HealthTest)
export class HealthInsuranceResolver {
  constructor(
    private readonly healthInsuranceService: HealthInsuranceService,
    private readonly bucketService: BucketService,
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

  @Query(() => Boolean, {
    name: 'healthInsuranceIsHealthInsured',
  })
  healthInsuranceIsHealthInsured(
    @CurrentUser() user: AuthUser,
  ): Promise<boolean> {
    return this.healthInsuranceService.isHealthInsured(user.nationalId)
    // return this.healthInsuranceService.isHealthInsured('0101006070') // TODO cleanup
  }

  @Query(() => [Number], {
    name: 'healthInsuranceGetPendingApplication',
  })
  healthInsuranceGetPendingApplication(
    @CurrentUser() user: AuthUser,
  ): Promise<number[]> {
    return this.healthInsuranceService.getPendingApplication(user.nationalId)
    // return this.healthInsuranceService.getPendingApplication('0101006070') // TODO cleanup
  }

  /* TESTING */
  @Query(() => String)
  async healthInsuranceBtest(): Promise<string | undefined> {
    console.log('testing...')
    return this.bucketService.btest()
  }
}
