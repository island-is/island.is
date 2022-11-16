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
import { AnonymityInVehicleRegistryApi } from '../anonymityInVehicleRegistry.service'
import { AnonymityStatus } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(
    private readonly anonymityInVehicleRegistryApi: AnonymityInVehicleRegistryApi,
  ) {}

  @Query(() => AnonymityStatus)
  getAnonymityStatus(@CurrentUser() user: User) {
    return {
      isChecked: this.anonymityInVehicleRegistryApi.getAnonymityStatus(user),
    }
  }
}
