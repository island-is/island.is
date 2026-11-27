import { UseGuards } from '@nestjs/common'
import { Query, ResolveField, Resolver } from '@nestjs/graphql'

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

import { DrivingLicensePenaltyPoints } from '../models/penalty/drivingLicensePenaltyPoints.model'
import { PenaltyPointsService } from '../services/penaltyPoints.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicensePenaltyPoints)
export class PenaltyPointsResolver {
  constructor(private readonly penaltyPointsService: PenaltyPointsService) {}

  @Scopes(ApiScope.internal)
  @Audit()
  @Query(() => DrivingLicensePenaltyPoints, { nullable: true })
  drivingLicensePenaltyPoints(
    @CurrentUser() user: User,
  ): Promise<Pick<DrivingLicensePenaltyPoints, 'details'>> {
    return this.penaltyPointsService.getPenaltyPointDetails(user)
  }

  @ResolveField('isDeprived', () => Boolean, { nullable: true })
  async resolveIsDeprived(
    @CurrentUser() user: User,
  ): Promise<boolean | undefined> {
    return this.penaltyPointsService.getIsDeprived(user)
  }
}
