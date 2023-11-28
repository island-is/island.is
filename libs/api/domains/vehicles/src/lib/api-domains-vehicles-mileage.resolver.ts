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
import { VehiclesService } from './api-domains-vehicles.service'
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

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleMileageOverview)
@Audit({ namespace: '@island.is/api/vehicles' })
@Scopes(ApiScope.vehicles)
export class VehiclesMileageResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

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
  postVehicleMileageReading(
    @Args('input') input: PostVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    return this.vehiclesService.postMileageReading(user, input)
  }

  @Mutation(() => VehicleMileagePutModel, {
    name: 'vehicleMileagePut',
    nullable: true,
  })
  @Audit()
  putVehicleMileageReading(
    @Args('input') input: PutVehicleMileageInput,
    @CurrentUser() user: User,
  ) {
    return this.vehiclesService.putMileageReading(user, input)
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
}
