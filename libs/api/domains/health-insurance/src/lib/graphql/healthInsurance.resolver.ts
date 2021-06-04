import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'

// import { VistaSkjalModel } from './models'
import { HealthInsuranceService } from '../healthInsurance.service'
// import { VistaSkjalInput } from '@island.is/health-insurance'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => String)
export class HealthInsuranceResolver {
  constructor(
    private readonly healthInsuranceService: HealthInsuranceService,
  ) {}

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

  // TODO remove so this function will not be public exposed
  // @Mutation(() => VistaSkjalModel, {
  //   name: 'healthInsuranceApplyInsurance',
  // })
  // async healthInsuranceApplyInsurance(
  //   @Args({ name: 'inputs', type: () => VistaSkjalInput })
  //   inputs: VistaSkjalInput,
  //   @CurrentUser() user: AuthUser,
  // ): Promise<VistaSkjalModel> {
  //   return this.healthInsuranceService.applyInsurance(inputs, user.nationalId)
  // }
}
