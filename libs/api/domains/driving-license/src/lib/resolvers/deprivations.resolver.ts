import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

import { DrivingLicenseDeprivation } from '../models/penalty/drivingLicenseDeprivation.model'
import { DrivingLicenseDeprivations } from '../models/penalty/drivingLicenseDeprivations.model'
import { DeprivationsService } from '../services/deprivations.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicenseDeprivation)
export class DeprivationsResolver {
  constructor(private readonly deprivationsService: DeprivationsService) {}

  @Scopes(ApiScope.internal)
  @Audit()
  @Query(() => DrivingLicenseDeprivation, { nullable: true })
  drivingLicenseDeprivation(
    @CurrentUser() user: User,
  ): Promise<DrivingLicenseDeprivation | null> {
    return this.deprivationsService.getDeprivation(user)
  }

  @Scopes(ApiScope.internal)
  @Audit()
  @Query(() => DrivingLicenseDeprivations, { nullable: true })
  drivingLicenseDeprivations(
    @CurrentUser() user: User,
  ): Promise<DrivingLicenseDeprivations> {
    return this.deprivationsService.getDeprivations(user)
  }
}
