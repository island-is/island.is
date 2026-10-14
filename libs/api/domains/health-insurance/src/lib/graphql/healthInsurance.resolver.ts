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
import { Features } from '@island.is/nest/feature-flags'
import { StepUpRequired } from '@island.is/api/domains/step-up'

const namespace = '@island.is/api/health-insurance'

// Insurance and accident status are health data too. Applications on the web
// use them as well, so only the app's sessions are locked.
@StepUpRequired(Features.isHealthStepUpRequired, { appsOnly: true })
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => String)
export class HealthInsuranceResolver {
  constructor(
    private readonly healthInsuranceService: HealthInsuranceService,
    private readonly auditService: AuditService,
  ) {}

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
        input?.date ?? new Date(),
      ),
    )
  }
}
