import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import { Authorize, Role } from '../auth'

import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import {
  UpdateAccessControlInput,
  CreateAccessControlInput,
} from './accessControl.input'

@Authorize({ throwOnUnAuthorized: false, role: Role.developer })
@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(private accessControlService: AccessControlService) {}

  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(): Promise<AccessControlModel[]> {
    return this.accessControlService.findAll()
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    @Args('input', { type: () => CreateAccessControlInput })
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    return this.accessControlService.createAccess(input)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    @Args('input', { type: () => UpdateAccessControlInput })
    input: UpdateAccessControlInput,
  ): Promise<AccessControlModel> {
    return this.accessControlService.updateAccess(input)
  }
}
