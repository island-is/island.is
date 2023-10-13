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
import { DirectorateOfImmigrationApi } from '../directorateOfImmigration.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly directorateOfImmigrationApi: DirectorateOfImmigrationApi,
  ) {}

  // @Scopes(ApiScope.internal)
  // @Query(() => String, {
  //   name: 'stuff',
  //   nullable: true,
  // })
  // async getStuff(
  //   @Args('key', { type: () => String }) key: string,
  //   @CurrentUser() user: User,
  // ) {
  //   return await this.directorateOfImmigrationApi.getStuff(user, key)
  // }
}
