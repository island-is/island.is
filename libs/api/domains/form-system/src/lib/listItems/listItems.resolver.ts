import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CreateListItemInput,
  DeleteListItemInput,
  TemplateListInput,
  UpdateListItemDisplayOrderInput,
  UpdateListItemInput,
} from '../../dto/listItem.input'
import { ListItem } from '../../models/listItem.model'
import { ListItemsService } from './listItems.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation(() => ListItem, {
    name: 'createFormSystemListItem',
  })
  async createListItem(
    @Args('input', { type: () => CreateListItemInput })
    input: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemsService.createListItem(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemListItem',
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
    name: 'updateFormSystemListItem',
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
    name: 'updateFormSystemListItemsDisplayOrder',
    nullable: true,
  })
  async updateListItemsDisplayOrder(
    @Args('input', { type: () => UpdateListItemDisplayOrderInput })
    input: UpdateListItemDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.listItemsService.updateListItemsDisplayOrder(user, input)
  }

  @Mutation(() => [ListItem], {
    name: 'applyFormSystemTemplateList',
  })
  async applyTemplateList(
    @Args('input', { type: () => TemplateListInput })
    input: TemplateListInput,
    @CurrentUser() user: User,
  ): Promise<ListItem[]> {
    return this.listItemsService.applyTemplateList(user, input)
  }
}
