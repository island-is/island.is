import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Environment } from '@island.is/shared/types'

import { GrantType } from './models/grant-type.model'
import { GrantTypesPayload } from './dto/grant-types.payload'
import { GrantTypesInput } from './dto/grant-types.input'
import { CreateGrantTypeInput } from './dto/create-grant-type.input'
import { UpdateGrantTypeInput } from './dto/update-grant-type.input'
import { DeleteGrantTypeInput } from './dto/delete-grant-type.input'
import { GrantTypeService } from './grant-type.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@Resolver(() => GrantType)
export class GrantTypeResolver {
  constructor(private readonly grantTypeService: GrantTypeService) {}

  @Query(() => GrantTypesPayload, { name: 'authAdminGrantTypes' })
  getGrantTypes(
    @CurrentUser() user: User,
    @Args('input') input: GrantTypesInput,
  ): Promise<GrantTypesPayload> {
    return this.grantTypeService.getGrantTypes(user, input)
  }

  @Query(() => GrantType, {
    name: 'authAdminGrantType',
    nullable: true,
  })
  getGrantType(
    @CurrentUser() user: User,
    @Args('name', { type: () => String }) name: string,
  ): Promise<GrantType | null> {
    return this.grantTypeService.getGrantType(user, name)
  }

  @Query(() => [Environment], {
    name: 'authAdminGrantTypeConfiguredEnvironments',
  })
  getConfiguredEnvironments(): Environment[] {
    return this.grantTypeService.getAvailableEnvironments()
  }

  @Mutation(() => GrantType, { name: 'createAuthAdminGrantType' })
  createGrantType(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateGrantTypeInput })
    input: CreateGrantTypeInput,
  ): Promise<GrantType> {
    return this.grantTypeService.createGrantType(user, input)
  }

  @Mutation(() => GrantType, { name: 'updateAuthAdminGrantType' })
  updateGrantType(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateGrantTypeInput })
    input: UpdateGrantTypeInput,
  ): Promise<GrantType> {
    return this.grantTypeService.updateGrantType(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthAdminGrantType' })
  deleteGrantType(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteGrantTypeInput })
    input: DeleteGrantTypeInput,
  ): Promise<boolean> {
    return this.grantTypeService.deleteGrantType(user, input.name)
  }
}
