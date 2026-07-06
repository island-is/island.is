import { Query, ResolveField, Resolver } from '@nestjs/graphql'
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
import { PenaltyPointsService } from '../services/penaltyPoints.service'
import { DrivingLicensePenaltyPoints } from '../models/penalty/drivingLicensePenaltyPoints.model'

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

  @ResolveField('isDeprived', () => Boolean)
  async resolveIsDeprived(@CurrentUser() user: User): Promise<boolean> {
    return this.penaltyPointsService.getIsDeprived(user)
  }
}
