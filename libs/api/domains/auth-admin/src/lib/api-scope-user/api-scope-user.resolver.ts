import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { ApiScopeUser } from './models/api-scope-user.model'
import { AccessControlledScope } from './models/access-controlled-scope.model'
import { ApiScopeUsersPayload } from './dto/api-scope-users.payload'
import { ApiScopeUsersInput } from './dto/api-scope-users.input'
import { CreateApiScopeUserInput } from './dto/create-api-scope-user.input'
import { UpdateApiScopeUserInput } from './dto/update-api-scope-user.input'
import { DeleteApiScopeUserInput } from './dto/delete-api-scope-user.input'
import { ApiScopeUserService } from './api-scope-user.service'

@UseGuards(IdsUserGuard)
@Resolver(() => ApiScopeUser)
export class ApiScopeUserResolver {
  constructor(private readonly apiScopeUserService: ApiScopeUserService) {}

  @Query(() => ApiScopeUsersPayload, { name: 'authAdminApiScopeUsers' })
  getApiScopeUsers(
    @CurrentUser() user: User,
    @Args('input') input: ApiScopeUsersInput,
  ): Promise<ApiScopeUsersPayload> {
    return this.apiScopeUserService.getApiScopeUsers(user, input)
  }

  @Query(() => ApiScopeUser, {
    name: 'authAdminApiScopeUser',
    nullable: true,
  })
  getApiScopeUser(
    @CurrentUser() user: User,
    @Args('nationalId', { type: () => String }) nationalId: string,
  ): Promise<ApiScopeUser | null> {
    return this.apiScopeUserService.getApiScopeUser(user, nationalId)
  }

  @Query(() => [AccessControlledScope], {
    name: 'authAdminAccessControlledScopes',
  })
  getAccessControlledScopes(
    @CurrentUser() user: User,
  ): Promise<AccessControlledScope[]> {
    return this.apiScopeUserService.getAccessControlledScopes(user)
  }

  @Mutation(() => ApiScopeUser, { name: 'createAuthAdminApiScopeUser' })
  createApiScopeUser(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateApiScopeUserInput })
    input: CreateApiScopeUserInput,
  ): Promise<ApiScopeUser> {
    return this.apiScopeUserService.createApiScopeUser(user, input)
  }

  @Mutation(() => ApiScopeUser, { name: 'updateAuthAdminApiScopeUser' })
  updateApiScopeUser(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateApiScopeUserInput })
    input: UpdateApiScopeUserInput,
  ): Promise<ApiScopeUser> {
    return this.apiScopeUserService.updateApiScopeUser(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthAdminApiScopeUser' })
  deleteApiScopeUser(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteApiScopeUserInput })
    input: DeleteApiScopeUserInput,
  ): Promise<boolean> {
    return this.apiScopeUserService.deleteApiScopeUser(user, input.nationalId)
  }
}
