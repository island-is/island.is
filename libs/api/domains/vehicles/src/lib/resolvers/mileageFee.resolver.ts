import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { GetVehicleMileageFeeInput } from '../dto/getVehicleMileageFeeInput'
import { MileageFee } from '../models/v3/mileageFee.model'
import { MileageFeeService } from '../services/mileageFee.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalVehicleMileageFeePageEnabled)
@Resolver(() => MileageFee)
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
@CodeOwner(CodeOwners.Hugsmidjan)
export class VehiclesMileageFeeResolver {
  constructor(private readonly mileageFeeService: MileageFeeService) {}

  @Query(() => MileageFee, { name: 'vehicleMileageFee', nullable: true })
  @Audit()
  getVehicleMileageFee(
    @Args('input') input: GetVehicleMileageFeeInput,
    @CurrentUser() user: User,
  ): Promise<MileageFee | null> {
    return this.mileageFeeService.getMileageFee(user, input)
  }
}
