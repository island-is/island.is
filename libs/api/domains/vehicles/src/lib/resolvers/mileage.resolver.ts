import {
  Args,
  Context,
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
import { mileageDetailConstructor } from '../utils/helpers'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { VehicleMileagePostResponse } from '../models/v3/postVehicleMileageResponse.model'
import { VehiclesMileageUpdateError } from '../models/v3/vehicleMileageResponseError.model'
import { VehicleMileagePutResponse } from '../models/v3/putVehicleMileageResponse.model'
import { ISLAND_IS_ORIGIN_CODE } from '../constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleMileageOverview)
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
export class VehiclesMileageResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
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
      originCode: ISLAND_IS_ORIGIN_CODE,
      mileage: Number(input.mileage ?? input.mileageNumber),
    })

    if (!res) {
      return
    }

    return mileageDetailConstructor({
      ...input,
      originCode: ISLAND_IS_ORIGIN_CODE,
      mileage: Number(input.mileage ?? input.mileageNumber),
      internalId: res.internalId,
    })
  }

  @Mutation(() => VehicleMileagePostResponse, {
    name: 'vehicleMileagePostV2',
    nullable: true,
  })
  @Audit()
  async postVehicleMileageReadingV2(
    @Args('input') input: PostVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    const res = await this.vehiclesService.postMileageReadingV2(user, {
      ...input,
      mileage: Number(input.mileage ?? input.mileageNumber),
    })

    if (!res || res instanceof VehiclesMileageUpdateError) {
      return res
    }

    return mileageDetailConstructor(res)
  }

  @Mutation(() => VehicleMileagePutResponse, {
    name: 'vehicleMileagePutV2',
    nullable: true,
  })
  @Audit()
  async putVehicleMileageReadingV2(
    @Args('input') input: PutVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    return this.vehiclesService.putMileageReadingV2(user, {
      ...input,
      originCode: ISLAND_IS_ORIGIN_CODE,
      mileage: Number(input.mileage ?? input.mileageNumber),
    })
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
