import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'

import { HealthInsuranceService } from '../healthInsurance.service'
import { IsHealthInsuredInput } from './dto'

const namespace = '@island.is/api/health-insurance'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
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
    @Args('input', { nullable: true }) input: IsHealthInsuredInput,
  ): Promise<boolean> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'healthInsuranceIsHealthInsured',
      },

      this.healthInsuranceService.isHealthInsured(
        user.nationalId,
        input?.date?.getTime(),
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
        auth: user,
        namespace,
        action: 'healthInsuranceGetPendingApplication',
        resources: (results) => results.map(String),
      },
      this.healthInsuranceService.getPendingApplication(user.nationalId),
    )
  }
}
