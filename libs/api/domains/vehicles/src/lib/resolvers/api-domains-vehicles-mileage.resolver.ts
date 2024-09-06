import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
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
import { VehiclesService } from '../services/vehicles.service'
import {
  VehicleMileageDetail,
  VehicleMileageOverview,
  VehicleMileagePutModel,
} from '../../models/getVehicleMileage.model'
import { GetVehicleMileageInput } from '../../dto/getVehicleMileageInput'
import {
  PostVehicleMileageInput,
  PutVehicleMileageInput,
} from '../../dto/postVehicleMileageInput'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { mileageDetailConstructor } from '../../utils/helpers'
import { VehiclesBulkMileageReadingResponse } from '../../models/bulkMileageReading.model'
import { PostVehicleBulkMileageInput } from '../../dto/postBulkVehicleMileage.input'
import { VehiclesBulkMileageRegistrationRequestCollection } from '../../models/bulkMileageRegistrationRequestsCollection.model'
import { VehiclesBulkMileageRegistrationRequestVehicleCollection } from '../../models/bulkMileageRegistrationRequestVehicleCollection.model'
import { BulkVehicleMileageRequestVehicleCollectionInput } from '../../dto/getBulkVehicleMileageRequestVehicle.input'
import { BulkMileageService } from '../services/bulkMileage.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalVehicleMileagePageEnabled)
@Resolver(() => VehicleMileageOverview)
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
export class VehiclesMileageResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly bulkService: BulkMileageService,
  ) {}

  @Query(() => VehicleMileageOverview, {
    name: 'vehicleMileageDetails',
    nullable: true,
  })
  @Audit()
  getVehicleMileage(
    @Args('input') input: GetVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    return this.vehiclesService.getVehicleMileage(user, input)
  }

  @Query(() => VehiclesBulkMileageRegistrationRequestCollection, {
    name: 'vehicleBulkMileageRegistrationRequestCollcetion',
    nullable: true,
  })
  @Audit()
  getVehicleMileageRegistrationRequests(@CurrentUser() user: User) {
    return this.bulkService.getBulkMileageReadingRequests(user)
  }

  @Query(() => VehiclesBulkMileageRegistrationRequestVehicleCollection, {
    name: 'vehicleBulkMileageRegistrationRequestVehicleCollcetion',
    nullable: true,
  })
  @Audit()
  getVehicleMileageRegistrationRequestsById(
    @CurrentUser() user: User,
    @Args('input') input: BulkVehicleMileageRequestVehicleCollectionInput,
  ) {
    return this.bulkService.getBulkMileageReadingRequestById(
      user,
      input.vehicleId,
    )
  }

  @Mutation(() => VehicleMileageDetail, {
    name: 'vehicleMileagePost',
    nullable: true,
  })
  @Audit()
  async postVehicleMileageReading(
    @Args('input') input: PostVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    const res = await this.vehiclesService.postMileageReading(user, {
      ...input,
      mileage: Number(input.mileage ?? input.mileageNumber),
    })

    if (!res) return undefined

    return mileageDetailConstructor(res)
  }

  @Mutation(() => VehicleMileagePutModel, {
    name: 'vehicleMileagePut',
    nullable: true,
  })
  @Audit()
  async putVehicleMileageReading(
    @Args('input') input: PutVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    const res = await this.vehiclesService.putMileageReading(user, {
      ...input,
      mileage: Number(input.mileage ?? input.mileageNumber),
    })

    if (!res) return undefined

    return mileageDetailConstructor(res[0])
  }

  @Mutation(() => VehiclesBulkMileageReadingResponse, {
    name: 'vehicleBulkMileagePost',
    nullable: true,
  })
  @Audit()
  async postBulkMileageReading(
    @Args('input') input: PostVehicleBulkMileageInput,
    @CurrentUser() user: User,
  ) {
    return this.bulkService.postBulkMileageReading(user, input)
  }

  @ResolveField('canRegisterMileage', () => Boolean, {
    nullable: true,
  })
  resolveCanRegisterMileage(
    @Context('req') { user }: { user: User },
    @Parent() overview: VehicleMileageOverview,
  ): Promise<boolean> {
    return this.vehiclesService.canRegisterMileage(user, {
      permno: overview.permno ?? '',
    })
  }

  @ResolveField('requiresMileageRegistration', () => Boolean, {
    nullable: true,
  })
  resolveRequiresMileageRegistration(
    @Context('req') { user }: { user: User },
    @Parent() overview: VehicleMileageOverview,
  ): Promise<boolean> {
    return this.vehiclesService.requiresMileageRegistration(user, {
      permno: overview?.permno ?? '',
    })
  }

  @ResolveField('canUserRegisterVehicleMileage', () => Boolean, {
    nullable: true,
  })
  resolveCanUserRegisterMileage(
    @Context('req') { user }: { user: User },
    @Parent() overview: VehicleMileageOverview,
  ): Promise<boolean> {
    return this.vehiclesService.canUserRegisterMileage(user, {
      permno: overview?.permno ?? '',
    })
  }
}
