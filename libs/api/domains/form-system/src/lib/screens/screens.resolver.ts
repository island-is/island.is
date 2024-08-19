import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ScreensService } from './screens.service'
import { CreateScreenInput, DeleteScreenInput, UpdateScreenInput, UpdateScreensDisplayOrderInput } from '../../dto/screen.input'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class ScreensResolver {
  constructor(private readonly screensService: ScreensService) { }

  @Mutation(() => Boolean, {
    name: 'formSystemCreateScreen',
  })
  async createScreen(
    @Args('input') input: CreateScreenInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.createScreen(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteScreen',
  })
  async deleteScreen(
    @Args('input') input: DeleteScreenInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.deleteScreen(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateScreen',
  })
  async updateScreen(
    @Args('input') input: UpdateScreenInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.updateScreen(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateScreensDisplayOrder',
  })
  async updateScreensDisplayOrder(
    @Args('input') input: UpdateScreensDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.screensService.updateScreensDisplayOrder(user, input)
  }
}
