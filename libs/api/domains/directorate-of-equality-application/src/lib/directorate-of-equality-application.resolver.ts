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

import { DraftEmployeesInput } from './dto/draftEmployees.input'
import {
  DraftEmployeesResponseModel,
  DraftEmployeesWithStepsResponseModel,
} from './dto/draftEmployeesResponse.model'
import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'
import { DirectorateOfEqualityApplicationService } from './directorate-of-equality-application.service'

// Sync carries an arbitrary per-screen payload, and the employee list queries
// carry a live page number — neither has a channel through defineTemplateApi
// providers (those only take a static actionId), hence a resolver of their own.
@Scopes(ApiScope.directorateOfEquality)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/directorate-of-equality-application' })
export class DirectorateOfEqualityApplicationResolver {
  constructor(
    private readonly directorateOfEqualityApplicationService: DirectorateOfEqualityApplicationService,
  ) {}

  @Mutation(() => Boolean, {
    name: 'directorateOfEqualitySyncSalaryReportDraft',
  })
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
}
