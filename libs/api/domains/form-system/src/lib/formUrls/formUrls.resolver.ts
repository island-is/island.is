import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { FormUrlDto } from '@island.is/form-system/shared'
import { FormUrlsService } from './formUrls.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormUrlsResolver {
  constructor(private readonly formUrlsService: FormUrlsService) {}

  @Mutation(() => FormUrlDto, {
    name: 'createFormSystemFormUrl',
  })
  async createFormUrl(
    @Args('input', { type: () => FormUrlDto })
    input: FormUrlDto,
    @CurrentUser() user: User,
  ): Promise<FormUrlDto> {
    return this.formUrlsService.createFormUrl(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemFormUrl',
    nullable: true,
  })
  async deleteFormUrl(
    @Args('input', { type: () => FormUrlDto })
    input: FormUrlDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formUrlsService.deleteFormUrl(user, input)
  }
}
