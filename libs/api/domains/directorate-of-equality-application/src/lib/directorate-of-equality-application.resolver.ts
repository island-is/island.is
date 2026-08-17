import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'
import { DirectorateOfEqualityApplicationService } from './directorate-of-equality-application.service'

// Only the batched `sync` call needs a resolver: create/import/submit/reads
// on the draft derive entirely from `application.answers`/`externalData`
// already, so they stay ordinary `defineTemplateApi` providers. `sync` is the
// one call that must carry an arbitrary, per-screen frontend-computed
// payload — the provider mechanism (`updateApplicationExternalData`) has no
// channel for that beyond `application.answers`, which is exactly what this
// migration exists to stop writing to.
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
}
