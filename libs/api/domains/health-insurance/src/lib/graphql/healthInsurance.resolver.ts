import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'

import { HealthInsuranceService } from '../healthInsurance.service'
import { IsHealthInsuredInput } from './dto'

const namespace = '@island.is/api/health-insurance'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => String)
export class HealthInsuranceResolver {
  constructor(
    private readonly healthInsuranceService: HealthInsuranceService,
    private readonly auditService: AuditService,
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
    @Args('input') input: IsHealthInsuredInput,
  ): Promise<boolean> {
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'healthInsuranceIsHealthInsured',
      },

      this.healthInsuranceService.isHealthInsured(
        user.nationalId,
        input.date?.getTime(),
      ),
    )
  }

  @Query(() => [Number], {
    name: 'healthInsuranceGetPendingApplication',
  })
  healthInsuranceGetPendingApplication(
    @CurrentUser() user: AuthUser,
  ): Promise<number[]> {
    return this.auditService.auditPromise<number[]>(
      {
        user,
        namespace,
        action: 'healthInsuranceGetPendingApplication',
        resources: (results) => results.map(String),
      },
      this.healthInsuranceService.getPendingApplication(user.nationalId),
    )
  }
}
