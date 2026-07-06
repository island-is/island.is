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
import { Audit, AuditService } from '@island.is/nest/audit'
import { PenaltyPointsService } from '../services/penaltyPoints.service'
import { DrivingLicensePenaltyPoints } from '../models/penalty/drivingLicensePenaltyPoints.model'
import { DrivingLicenseDeprivation } from '../models/penalty/drivingLicenseDeprivation.model'
import { DrivingLicensePenaltyPointDetail } from '../models'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicensePenaltyPoints)
export class PenaltyPointsResolver {
  constructor(
    private readonly penaltyPointsService: PenaltyPointsService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(ApiScope.internal)
  @Audit()
  @Query(() => DrivingLicensePenaltyPoints, { nullable: true })
  drivingLicensePenaltyPoints(
    @CurrentUser() user: User,
  ): Promise<Array<DrivingLicensePenaltyPointDetail>> {
    return this.penaltyPointsService.getPenaltyPointDetails(user)
  }

  @ResolveField('isDeprived', () => Boolean)
  async resolveIsDeprived(@CurrentUser() user: User): Promise<boolean> {
    return this.penaltyPointsService.getIsDeprived(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [DrivingLicenseDeprivation], { nullable: true })
  drivingLicenseDeprivations(
    @CurrentUser() user: User,
  ): Promise<Array<DrivingLicenseDeprivation>> {
    return this.penaltyPointsService.getDeprivations(user)
  }
}
