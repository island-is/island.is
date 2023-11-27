import { Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { InnaClientService } from '@island.is/clients/inna'
import { ApiScope } from '@island.is/auth/scopes'

import { PeriodsModel } from './inna/periods.model'
import { DiplomaModel } from './inna/diplomas.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@FeatureFlag(Features.servicePortalSecondaryEducationPages)
@Audit({ namespace: '@island.is/api/education-inna' })
export class InnaResolver {
  constructor(private innaService: InnaClientService) {}

  @Query(() => PeriodsModel, { name: 'innaPeriods' })
  @Audit()
  async innaPeriods(@CurrentUser() user: User): Promise<PeriodsModel | null> {
    const data = await this.innaService.getPeriods(user)
    return data
  }

  @Query(() => DiplomaModel, { name: 'innaDiplomas' })
  @Audit()
  async innaDiplomas(@CurrentUser() user: User): Promise<DiplomaModel | null> {
    const data = await this.innaService.getDiplomas(user)
    return data
  }
}
