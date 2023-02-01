import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
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
  GetCurrentVehiclesInput,
  OperatorChangeAnswers,
} from './dto'
import {
  CheckTachoNetExists,
  OperatorChangeValidation,
  OwnerChangeValidation,
  VehicleOperatorChangeChecksByPermno,
  VehicleOwnerchangeChecksByPermno,
  VehiclePlateOrderChecksByPermno,
  VehiclesCurrentVehicleWithPlateOrderChecks,
  VehiclesCurrentVehicleWithOperatorChangeChecks,
  VehiclesCurrentVehicleWithOwnerchangeChecks,
} from './models'

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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => [VehiclesCurrentVehicleWithOwnerchangeChecks], {
    name: 'currentVehiclesWithOwnerchangeChecks',
    nullable: true,
  })
  async getCurrentVehiclesWithOwnerchangeChecks(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getCurrentVehiclesWithOwnerchangeChecks(
      user,
      input.showOwned,
      input.showCoOwned,
      input.showOperated,
    )
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => [VehiclesCurrentVehicleWithOperatorChangeChecks], {
    name: 'currentVehiclesWithOperatorChangeChecks',
    nullable: true,
  })
  async getCurrentVehiclesWithOperatorChangeChecks(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getCurrentVehiclesWithOperatorChangeChecks(
      user,
      input.showOwned,
      input.showCoOwned,
      input.showOperated,
    )
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
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

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => [VehiclesCurrentVehicleWithPlateOrderChecks], {
    name: 'currentVehiclesWithPlateOrderChecks',
    nullable: true,
  })
  async getCurrentVehiclesWithPlateOrderChecks(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getCurrentVehiclesWithPlateOrderChecks(
      user,
      input.showOwned,
      input.showCoOwned,
      input.showOperated,
    )
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
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
}
