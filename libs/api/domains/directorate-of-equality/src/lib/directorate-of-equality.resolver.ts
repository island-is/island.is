import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  // TODO: restore scope check
  // Scopes,
  // ScopesGuard,
} from '@island.is/auth-nest-tools'
// import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { DirectorateOfEqualityService } from './directorate-of-equality.service'
import { SubmissionsInput } from './dto/submissions.input'
import { Submissions } from './models/submissions.model'

// TODO: restore scope check
// @UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
// @Scopes(ApiScope.directorateOfEqualityCompany)
@UseGuards(IdsUserGuard, FeatureFlagGuard)
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
}
