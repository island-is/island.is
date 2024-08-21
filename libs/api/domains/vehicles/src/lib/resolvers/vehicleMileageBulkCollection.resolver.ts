import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { VehicleMileageBulkCollection } from '../../models/vehicleMileageBulkCollection.model'
import { BulkMileageService } from '../services/bulkMileage.service'
import { GetBulkMileageVehicleListInput } from '../../dto/getBulkMileageVehicleList.input'
import { VehicleMileageBulkEntry } from '../../models/vehicleMileageBulkEntry.model'
import { PostBulkVehicleMileageInput } from '../../dto/postBulkVehicleMileageReading.input'
import { VehicleMileageDetail } from '../../models/getVehicleMileage.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalVehicleMileagePageEnabled)
@Resolver(() => VehicleMileageBulkCollection)
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
export class VehicleMileageBulkCollectionResolver {
  constructor(private readonly service: BulkMileageService) {}

  @Mutation(() => Boolean, {
    name: 'vehicleMileageBulkCollectionPostMileage',
    nullable: true,
  })
  @Audit()
  async postVehicleMileageReading(
    @Args('input') input: PostBulkVehicleMileageInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.service.postMileageReading(user, input)
  }

  @Query(() => VehicleMileageBulkCollection, {
    name: 'vehicleMileageBulkCollection',
  })
  @Audit()
  async vehicleMileageBulkCollection(
    @CurrentUser() user: User,
    @Args('input') input: GetBulkMileageVehicleListInput,
  ) {
    return this.service.getUserVehiclesPagedResponse(user, input)
  }

  @ResolveField(() => [VehicleMileageBulkEntry], {
    name: 'vehicles',
  })
  @Audit()
  async resolveMileageRegistration(
    @CurrentUser() user: User,
    @Parent() collection: VehicleMileageBulkCollection,
  ) {
    return collection.vehicles.map(async (vehicle) => {
      const vehicleReading = await this.service.getMileageReadings(
        user,
        vehicle.permNo,
      )

      if (!vehicleReading) {
        return vehicle
      }

      const latestRegistration = vehicleReading?.readings?.[0]

      return {
        ...vehicle,
        isCurrentlyEditing: vehicleReading.isEditing,
        canUserRegisterVehicleMileage:
          vehicleReading.canUserRegisterVehicleMileage,
        latestRegistration: {
          date: latestRegistration.date,
          origin: latestRegistration.origin,
          mileage: latestRegistration.mileage,
        },
        mileageRegistrationHistory: vehicleReading.readings.map((r) => ({
          date: r.date,
          origin: r.origin,
          mileage: r.mileage,
        })),
      }
    })
  }
}
