import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { DraftEmployeesInput } from './dto/draftEmployees.input'
import {
  DraftEmployeesResponseModel,
  DraftEmployeesWithStepsResponseModel,
} from './dto/draftEmployeesResponse.model'
import { EditEqualityContentInput } from './dto/editEqualityContent.input'
import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'
import { UpdateEqualityDraftContentInput } from './dto/updateEqualityDraftContent.input'
import { DirectorateOfEqualityApplicationService } from './directorate-of-equality-application.service'

// Sync carries an arbitrary per-screen payload, and the employee list queries
// carry a live page number — neither has a channel through defineTemplateApi
// providers (those only take a static actionId), hence a resolver of their own.
// Each handler names its scope: the salary report and the equality report are
// granted separately.
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isDirectorateOfEqualityApplicationsEnabled)
@Resolver()
@Audit({ namespace: '@island.is/api/directorate-of-equality-application' })
export class DirectorateOfEqualityApplicationResolver {
  constructor(
    private readonly directorateOfEqualityApplicationService: DirectorateOfEqualityApplicationService,
  ) {}

  @Mutation(() => Boolean, {
    name: 'directorateOfEqualitySyncSalaryReportDraft',
  })
  @Scopes(ApiScope.directorateOfEqualitySalary)
  @Audit()
  syncSalaryReportDraft(
    @Args('input') input: SyncSalaryReportDraftInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfEqualityApplicationService.syncSalaryReportDraft(
      input,
      user,
    )
  }

  @Query(() => DraftEmployeesResponseModel, {
    name: 'directorateOfEqualityDraftEmployees',
  })
  @Scopes(ApiScope.directorateOfEqualitySalary)
  @Audit()
  draftEmployees(
    @Args('input') input: DraftEmployeesInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfEqualityApplicationService.listDraftEmployees(
      input,
      user,
    )
  }

  @Query(() => DraftEmployeesWithStepsResponseModel, {
    name: 'directorateOfEqualityDraftEmployeesWithSteps',
  })
  @Scopes(ApiScope.directorateOfEqualitySalary)
  @Audit()
  draftEmployeesWithSteps(
    @Args('input') input: DraftEmployeesInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfEqualityApplicationService.listDraftEmployeesWithSteps(
      input,
      user,
    )
  }

  @Mutation(() => Boolean, {
    name: 'directorateOfEqualityUpdateEqualityDraftContent',
  })
  @Scopes(ApiScope.directorateOfEquality)
  @Audit()
  updateEqualityDraftContent(
    @Args('input') input: UpdateEqualityDraftContentInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfEqualityApplicationService.updateEqualityDraftContent(
      input,
      user,
    )
  }

  @Mutation(() => Boolean, {
    name: 'directorateOfEqualityEditEqualityContent',
  })
  @Scopes(ApiScope.directorateOfEquality)
  @Audit()
  editEqualityContent(
    @Args('input') input: EditEqualityContentInput,
    @CurrentUser() user: User,
  ) {
    return this.directorateOfEqualityApplicationService.editEqualityContent(
      input,
      user,
    )
  }
}
