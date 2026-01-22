import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { PostVehicleBulkMileageFileInput } from '../dto/postBulkVehicleMileage.input'
import { BulkMileageService } from '../services/bulkMileage.service'
import { VehiclesBulkMileageReadingResponse } from '../models/v3/bulkMileage/bulkMileageReadingResponse.model'
import { VehiclesBulkMileageRegistrationRequestOverview } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestOverview.model'
import { VehiclesBulkMileageRegistrationJobHistory } from '../models/v3/bulkMileage/bulkMileageRegistrationJobHistory.model'
import { VehiclesBulkMileageRegistrationRequestStatus } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestStatus.model'
import { BulkVehicleMileageRequestStatusInput } from '../dto/getBulkVehicleMileageRequestStatus.input'
import { BulkVehicleMileageRequestOverviewInput } from '../dto/getBulkVehicleMileageRequestOverview.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
export class VehiclesBulkMileageResolver {
  constructor(private readonly bulkService: BulkMileageService) {}

  @Query(() => VehiclesBulkMileageRegistrationJobHistory, {
    name: 'vehicleBulkMileageRegistrationJobHistory',
    nullable: true,
  })
  @Audit()
  getVehicleMileageRegistrationJobHistory(@CurrentUser() user: User) {
    return this.bulkService.getBulkMileageRegistrationJobHistory(user)
  }

  @Query(() => VehiclesBulkMileageRegistrationRequestStatus, {
    name: 'vehicleBulkMileageRegistrationRequestStatus',
    nullable: true,
  })
  @Audit()
  getVehicleMileageRegistrationRequestStatus(
    @CurrentUser() user: User,
    @Args('input') input: BulkVehicleMileageRequestStatusInput,
  ) {
    return this.bulkService.getBulkMileageRegistrationRequestStatus(
      user,
      input.requestId,
    )
  }

  @Query(() => VehiclesBulkMileageRegistrationRequestOverview, {
    name: 'vehicleBulkMileageRegistrationRequestOverview',
    nullable: true,
  })
  @Audit()
  getVehicleMileageRegistrationRequestOverview(
    @CurrentUser() user: User,
    @Args('input') input: BulkVehicleMileageRequestOverviewInput,
  ) {
    return this.bulkService.getBulkMileageRegistrationRequestOverview(
      user,
      input.locale,
      input.guid,
    )
  }

  @Mutation(() => VehiclesBulkMileageReadingResponse, {
    nullable: true,
    name: 'vehicleBulkMileagePostFile',
  })
  async postBulkMileageFile(
    @Args('input', { type: () => PostVehicleBulkMileageFileInput })
    input: PostVehicleBulkMileageFileInput,
    @CurrentUser() user: User,
  ) {
    return await this.bulkService.postBulkMileageFile(user, input)
  }
}
