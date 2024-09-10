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
} from '../models/getVehicleMileage.model'
import { GetVehicleMileageInput } from '../dto/getVehicleMileageInput'
import {
  PostVehicleMileageInput,
  PutVehicleMileageInput,
} from '../dto/postVehicleMileageInput'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { mileageDetailConstructor } from '../utils/helpers'
import { PostVehicleBulkMileageInput } from '../dto/postBulkVehicleMileage.input'
import { BulkMileageService } from '../services/bulkMileage.service'
import { VehiclesBulkMileageReadingResponse } from '../models/v3/bulkMileage/bulkMileageReadingResponse.model'
import { VehiclesBulkMileageRegistrationRequestOverview } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestOverview.model'
import { VehiclesBulkMileageRegistrationJobHistory } from '../models/v3/bulkMileage/bulkMileageRegistrationJobHistory.model'
import { VehiclesBulkMileageRegistrationRequestStatus } from '../models/v3/bulkMileage/bulkMileageRegistrationRequestStatus.model'
import { BulkVehicleMileageRequestStatusInput } from '../dto/getBulkVehicleMileageRequestStatus.input'
import { BulkVehicleMileageRequestOverviewInput } from '../dto/getBulkVehicleMileageRequestOverview.input'

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
      input.guid,
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
