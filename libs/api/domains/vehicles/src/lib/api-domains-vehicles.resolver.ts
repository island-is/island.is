import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { UsersVehicles } from '../models/usersVehicles.model'
import { Audit, AuditService } from '@island.is/nest/audit'
import graphqlTypeJson from 'graphql-type-json'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { GetVehiclesForUserInput } from '../dto/getVehiclesForUserInput'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => UsersVehicles, { name: 'getVehiclesForUser' })
  @Audit()
  async getVehicleForUser(@CurrentUser() user: User) {
    return await this.vehiclesService.getVehiclesForUser(user.nationalId)
  }

  @Query(() => UsersVehicles, { name: 'getVehicleDetail' })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehicleDetail({
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
  }
}
