import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User as AuthUser,
} from '@island.is/auth-nest-tools'

import { VistaSkjalModel } from './models'
import { HealthInsuranceService } from '../healthInsurance.service'
import { VistaSkjalInput } from '../types'

@UseGuards(IdsAuthGuard, ScopesGuard) // TODO: enable when go to dev/prod
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

  @Query(() => VistaSkjalModel, {
    name: 'healthInsuranceApplyInsurance',
  })
  async healthInsuranceApplyInsurance(
    @Args({ name: 'input', type: () => VistaSkjalInput })
    inputs: VistaSkjalInput,
  ): Promise<VistaSkjalModel> {
    return this.healthInsuranceService.applyInsurance(inputs)
  }
}
