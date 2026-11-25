import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { DirectorateOfEqualityService } from './directorate-of-equality.service'
import { DetailInput } from './dto/detail.input'
import { ImprovementAction } from './models/improvementAction.model'
import { Report } from './models/report.model'
import type { ReportWithContext } from './models/report.model'

const namespace = '@island.is/api/directorate-of-equality'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.directorateOfEqualityCompany)
@FeatureFlag(Features.isServicePortalEqualityPageEnabled)
@Audit({ namespace })
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => Report)
export class ReportResolver {
  constructor(
    private readonly directorateOfEqualityService: DirectorateOfEqualityService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => Report, { name: 'directorateOfEqualityReport', nullable: true })
  @Audit()
  report(
    @Args('input') input: DetailInput,
    @CurrentUser() user: User,
  ): Promise<ReportWithContext | null> {
    return this.directorateOfEqualityService.getReport(user, input)
  }

  @ResolveField('improvementPlan', () => [ImprovementAction])
  async resolveImprovementPlan(
    @Context('req') { user }: { user: User },
    @Parent() { id, includesImprovementPlan }: ReportWithContext,
  ): Promise<ImprovementAction[]> {
    if (!includesImprovementPlan) return []
    this.auditService.audit({
      auth: user,
      namespace,
      action: 'resolveImprovementPlan',
      resources: id,
    })
    return this.directorateOfEqualityService.getImprovementPlan(user, id)
  }
}
