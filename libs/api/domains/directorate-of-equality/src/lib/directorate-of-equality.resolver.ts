import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { DirectorateOfEqualityService } from './directorate-of-equality.service'
import { DetailInput } from './dto/detail.input'
import { SubmissionsInput } from './dto/submissions.input'
import { EqualityPlan } from './models/equalityPlan.model'
import { Pdf } from './models/pdf.model'
import { Submissions } from './models/submissions.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.directorateOfEqualityCompany)
@FeatureFlag(Features.isServicePortalEqualityPageEnabled)
@Audit({ namespace: '@island.is/api/directorate-of-equality' })
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class DirectorateOfEqualityResolver {
  constructor(
    private readonly directorateOfEqualityService: DirectorateOfEqualityService,
  ) {}

  @Query(() => Submissions, {
    name: 'directorateOfEqualitySubmissions',
    nullable: true,
  })
  @Audit()
  submissions(
    @Args('input') input: SubmissionsInput,
    @CurrentUser() user: User,
  ): Promise<Submissions | null> {
    return this.directorateOfEqualityService.getSubmissions(user, input)
  }

  @Query(() => EqualityPlan, {
    name: 'directorateOfEqualityEqualityPlan',
    nullable: true,
  })
  @Audit()
  equalityPlan(
    @Args('input') input: DetailInput,
    @CurrentUser() user: User,
  ): Promise<EqualityPlan | null> {
    return this.directorateOfEqualityService.getEqualityPlan(user, input)
  }

  @Query(() => Pdf, {
    name: 'directorateOfEqualityReportPdf',
    nullable: true,
    description:
      'The signed-off equality plan or salary report as a PDF; only when hasPdf is true',
  })
  @Audit()
  reportPdf(
    @Args('input') input: DetailInput,
    @CurrentUser() user: User,
  ): Promise<Pdf | null> {
    return this.directorateOfEqualityService.getReportPdf(user, input)
  }

  @Query(() => Pdf, {
    name: 'directorateOfEqualityImprovementPlanPdf',
    nullable: true,
    description:
      'The salary report úrbótaáætlun as a PDF; only when hasPdf is true and the improvement plan is not empty',
  })
  @Audit()
  improvementPlanPdf(
    @Args('input') input: DetailInput,
    @CurrentUser() user: User,
  ): Promise<Pdf | null> {
    return this.directorateOfEqualityService.getImprovementPlanPdf(user, input)
  }
}
