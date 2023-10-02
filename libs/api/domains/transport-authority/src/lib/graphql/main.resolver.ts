import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { TransportAuthorityApi } from '../transportAuthority.service'
import {
  OwnerChangeAnswers,
  CheckTachoNetInput,
  OperatorChangeAnswers,
  PlateAvailabilityInput,
} from './dto'
import {
  CheckTachoNetExists,
  OperatorChangeValidation,
  OwnerChangeValidation,
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  MyPlateOwnershipChecksByRegno,
  PlateAvailability,
} from './models'
import { CoOwnerChangeAnswers } from './dto/coOwnerChangeAnswers.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly transportAuthorityApi: TransportAuthorityApi) {}

  @Scopes(ApiScope.internal)
  @Query(() => CheckTachoNetExists)
  digitalTachographTachoNetExists(
    @CurrentUser() user: User,
    @Args('input') input: CheckTachoNetInput,
  ) {
    return this.transportAuthorityApi.checkTachoNet(user, input)
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => VehicleOwnerchangeChecksByPermno, {
    name: 'vehicleOwnerchangeChecksByPermno',
    nullable: true,
  })
  async getVehicleOwnerchangeChecksByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getVehicleOwnerchangeChecksByPermno(
      user,
      permno,
    )
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => OwnerChangeValidation, { nullable: true })
  vehicleOwnerChangeValidation(
    @CurrentUser() user: User,
    @Args('answers') answers: OwnerChangeAnswers,
  ) {
    return this.transportAuthorityApi.validateApplicationForOwnerChange(
      user,
      answers,
    )
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => OwnerChangeValidation, { nullable: true })
  vehicleCoOwnerChangeValidation(
    @CurrentUser() user: User,
    @Args('answers') answers: CoOwnerChangeAnswers,
  ) {
    return this.transportAuthorityApi.validateApplicationForCoOwnerChange(
      user,
      answers,
    )
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => VehicleOperatorChangeChecksByPermno, {
    name: 'vehicleOperatorChangeChecksByPermno',
    nullable: true,
  })
  async getVehicleOperatorChangeChecksByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getVehicleOperatorChangeChecksByPermno(
      user,
      permno,
    )
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => OperatorChangeValidation, { nullable: true })
  vehicleOperatorChangeValidation(
    @CurrentUser() user: User,
    @Args('answers') answers: OperatorChangeAnswers,
  ) {
    return this.transportAuthorityApi.validateApplicationForOperatorChange(
      user,
      answers,
    )
  }

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => VehiclePlateOrderChecksByPermno, {
    name: 'vehiclePlateOrderChecksByPermno',
    nullable: true,
  })
  async getVehiclePlateOrderChecksByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getVehiclePlateOrderChecksByPermno(
      user,
      permno,
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => MyPlateOwnershipChecksByRegno, {
    name: 'myPlateOwnershipChecksByRegno',
    nullable: true,
  })
  async getMyPlateOwnershipChecksByRegno(
    @Args('regno', { type: () => String }) regno: string,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getMyPlateOwnershipChecksByRegno(
      user,
      regno,
    )
  }

  @BypassAuth()
  @Query(() => PlateAvailability)
  async plateAvailable(@Args('input') input: PlateAvailabilityInput) {
    return this.transportAuthorityApi.getPlateAvailability(input.regno)
  }
}
