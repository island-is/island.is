import { UseGuards } from '@nestjs/common'
import { Resolver, Args, Mutation } from '@nestjs/graphql'

import {
  RecyclingRequestModel,
  RecyclingRequestResponse,
  RequestStatus,
} from './recyclingRequest.model'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { CreateRecyclingRequestInput } from './dto/createRecyclingRequest.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestAppSysResolver {
  constructor() {}

  @Mutation(() => RequestStatus)
  async createRecyclingRequestAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateRecyclingRequestInput,
  ): Promise<typeof RecyclingRequestResponse> {
    console.log('received request to create recycling request', { input, user })

    return {
      status: true,
    }
  }
}
