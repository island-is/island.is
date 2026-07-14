import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Audit } from '@island.is/nest/audit'
import { DeprivationsService } from '../services/deprivations.service'
import { DrivingLicenseDeprivations } from '../models/penalty/drivingLicenseDeprivations.model'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicenseDeprivations)
export class DeprivationsResolver {
  constructor(private readonly deprivationsService: DeprivationsService) {}

  @Scopes(ApiScope.internal)
  @Audit()
  @Query(() => DrivingLicenseDeprivations)
  drivingLicenseDeprivations(
    @CurrentUser() user: User,
  ): Promise<DrivingLicenseDeprivations> {
    return this.deprivationsService.getDeprivations(user)
  }
}
