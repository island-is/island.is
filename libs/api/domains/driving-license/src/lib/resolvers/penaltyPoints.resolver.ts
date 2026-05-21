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
import { AuditService } from '@island.is/nest/audit'
import { PenaltyPointsService } from '../services/penaltyPoints.service'
import { DrivingLicensePenaltyPointDetail } from '../models/penalty/drivingLicensePenaltyPointDetail.model'
import { DrivingLicenseDeprivation } from '../models/penalty/drivingLicenseDeprivation.model'

const namespace = '@island.is/api/driving-license'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => DrivingLicensePenaltyPointDetail)
export class PenaltyPointsResolver {
  constructor(
    private readonly penaltyPointsService: PenaltyPointsService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => [DrivingLicensePenaltyPointDetail], { nullable: true })
  driversPenaltyPointDetails(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'driversPenaltyPointDetails',
        resources: user.nationalId,
      },
      this.penaltyPointsService.getPenaltyPointDetails(user),
    )
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
