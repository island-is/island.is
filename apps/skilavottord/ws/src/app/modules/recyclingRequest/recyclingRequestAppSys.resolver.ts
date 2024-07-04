import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser, User } from '../auth'
import { CreateRecyclingRequestInput } from './dto/createRecyclingRequest.input'
import {
  RecyclingRequestModel,
  RecyclingRequestResponse,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestAppSysResolver {
  constructor(private recyclingRequestService: RecyclingRequestService) {}

  @Mutation(() => RecyclingRequestResponse)
  async createSkilavottordRecyclingRequestAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateRecyclingRequestInput,
  ): Promise<typeof RecyclingRequestResponse> {
    user.name = input.fullName

    return this.recyclingRequestService.createRecyclingRequest(
      user,
      input.requestType,
      input.permno,
    )
  }
}
