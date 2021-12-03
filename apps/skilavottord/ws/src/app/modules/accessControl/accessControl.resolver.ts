import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import { Authorize, AuthService, AuthUser, CurrentUser } from '../auth'

import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import {
  UpdateAccessControlInput,
  CreateAccessControlInput,
} from './accessControl.input'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(
    private accessControlService: AccessControlService,
    private authService: AuthService,
  ) {}

  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(
    @CurrentUser() user: AuthUser,
  ): Promise<AccessControlModel[]> {
    this.authService.verifyPermission(user, 'developer')
    return this.accessControlService.findAll()
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    @CurrentUser() user: AuthUser,
    @Args('input', { type: () => CreateAccessControlInput })
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    this.authService.verifyPermission(user, 'developer')
    return this.accessControlService.createAccess(input)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    @CurrentUser() user: AuthUser,
    @Args('input', { type: () => UpdateAccessControlInput })
    input: UpdateAccessControlInput,
  ): Promise<AccessControlModel> {
    this.authService.verifyPermission(user, 'developer')
    return this.accessControlService.updateAccess(input)
  }
}
