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
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => graphqlTypeJson, { name: 'getVehiclesForUser' })
  @Audit()
  async getVehicleForUser(@CurrentUser() user: User) {
    return this.vehiclesService.getVehiclesForUser(user.nationalId)
  }
}
