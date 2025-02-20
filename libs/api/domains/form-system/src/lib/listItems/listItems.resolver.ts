import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ListItemsService } from './listItems.service'
import {
  CreateListItemInput,
  DeleteListItemInput,
  ListItemDto,
  UpdateListItemInput,
  UpdateListItemsDisplayOrderInput,
} from '@island.is/form-system-dto'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation(() => ListItemDto, {
    name: 'formSystemCreateListItem',
  })
  async createListItem(
    @Args('input', { type: () => CreateListItemInput })
    input: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItemDto> {
    return this.listItemsService.createListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteListItem',
    nullable: true,
  })
  async deleteListItem(
    @Args('input', { type: () => DeleteListItemInput })
    input: DeleteListItemInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.deleteListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateListItem',
    nullable: true,
  })
  async updateListItem(
    @Args('input', { type: () => UpdateListItemInput })
    input: UpdateListItemInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.updateListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateListItemsDisplayOrder',
    nullable: true,
  })
  async updateListItemsDisplayOrder(
    @Args('input', { type: () => UpdateListItemsDisplayOrderInput })
    input: UpdateListItemsDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.updateListItemsDisplayOrder(user, input)
  }
}
