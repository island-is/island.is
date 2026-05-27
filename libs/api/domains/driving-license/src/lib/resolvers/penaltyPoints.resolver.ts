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
import { AuditService } from '@island.is/nest/audit'
import { PenaltyPointsService } from '../services/penaltyPoints.service'
import { DrivingLicensePenaltyPoints } from '../models/penalty/drivingLicensePenaltyPoints.model'
import { DrivingLicenseDeprivation } from '../models/penalty/drivingLicenseDeprivation.model'

const namespace = '@island.is/api/driving-license'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicensePenaltyPoints)
export class PenaltyPointsResolver {
  constructor(
    private readonly penaltyPointsService: PenaltyPointsService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => DrivingLicensePenaltyPoints, { nullable: true })
  driversPenaltyPoints(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'driversPenaltyPoints',
        resources: user.nationalId,
      },
      this.penaltyPointsService.getPenaltyPointDetails(user),
    )
  }

  @Scopes(ApiScope.internal)
  @ResolveField('isDeprived', () => Boolean)
  async resolveIsDeprived(@CurrentUser() user: User): Promise<boolean> {
    return this.penaltyPointsService.getIsDeprived(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [DrivingLicenseDeprivation], { nullable: true })
  driversDeprivations(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'driversDeprivations',
        resources: user.nationalId,
      },
      this.penaltyPointsService.getDeprivations(user),
    )
  }
}
