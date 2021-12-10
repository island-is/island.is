import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import { Authorize, AuthService, CurrentUser, Role } from '../auth'
import type { AuthUser } from '../auth'

import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import {
  UpdateAccessControlInput,
  CreateAccessControlInput,
  DeleteAccessControlInput,
} from './accessControl.input'
import { ApolloError } from 'apollo-server-express'

@Authorize({
  throwOnUnAuthorized: false,
  roles: [Role.developer, Role.recyclingFund],
})
@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(
    private accessControlService: AccessControlService,
    private authService: AuthService,
  ) {}

  private verifyDeveloperAccess(user: AuthUser, role: Role) {
    const isDeveloper = this.authService.getRole(user) === Role.developer
    if (!isDeveloper && role === Role.developer) {
      throw new ApolloError('Only developers can modify developer access')
    }
  }

  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(
    @CurrentUser() user: AuthUser,
  ): Promise<AccessControlModel[]> {
    const isDeveloper = this.authService.getRole(user) === Role.developer
    return this.accessControlService.findAll(isDeveloper)
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    @Args('input', { type: () => CreateAccessControlInput })
    input: CreateAccessControlInput,
    @CurrentUser() user: AuthUser,
  ): Promise<AccessControlModel> {
    this.verifyDeveloperAccess(user, input.role)
    return this.accessControlService.createAccess(input)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    @Args('input', { type: () => UpdateAccessControlInput })
    input: UpdateAccessControlInput,
    @CurrentUser() user: AuthUser,
  ): Promise<AccessControlModel> {
    this.verifyDeveloperAccess(user, input.role)
    return this.accessControlService.updateAccess(input)
  }

  @Mutation(() => Boolean)
  async deleteSkilavottordAccessControl(
    @Args('input', { type: () => DeleteAccessControlInput })
    input: DeleteAccessControlInput,
    @CurrentUser() user: AuthUser,
  ): Promise<Boolean> {
    const accessControl = await this.accessControlService.findOne(
      input.nationalId,
    )
    this.verifyDeveloperAccess(user, accessControl.role)
    return this.accessControlService.deleteAccess(input)
  }
}
