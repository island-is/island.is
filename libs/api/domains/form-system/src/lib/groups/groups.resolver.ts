import { Query, Args, Resolver, Mutation } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { GroupsService } from './groups.service'
import {
  GetGroupInput,
  CreateGroupInput,
  DeleteGroupInput,
  UpdateGroupInput,
} from '../../dto/groups.input'
import { Group } from '../../models/group.model'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @Query(() => Group, {
    name: 'formSystemGetGroup',
  })
  async getGroup(
    @Args('input', { type: () => GetGroupInput }) input: GetGroupInput,
    @CurrentUser() user: User,
  ): Promise<Group> {
    return this.groupsService.getGroup(user, input)
  }

  @Mutation(() => Group, {
    name: 'formSystemCreateGroup',
  })
  async postGroup(
    @Args('input', { type: () => CreateGroupInput }) input: CreateGroupInput,
    @CurrentUser() user: User,
  ): Promise<Group> {
    return this.groupsService.postGroup(user, input)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemDeleteGroup',
  })
  async deleteGroup(
    @Args('input', { type: () => DeleteGroupInput }) input: DeleteGroupInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.groupsService.deleteGroup(user, input)
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'formSystemUpdateGroup',
  })
  async updateGroup(
    @Args('input', { type: () => UpdateGroupInput }) input: UpdateGroupInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.groupsService.updateGroup(user, input)
  }
}
