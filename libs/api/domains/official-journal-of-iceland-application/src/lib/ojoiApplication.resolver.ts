import { Args, Query, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { OfficialJournalOfIcelandApplicationService } from './ojoiApplication.service'
import { GetCommentsInput } from '../models/getComments.input'
import { GetCommentsResponse } from '../models/getComments.response'
import { PostCommentInput } from '../models/postComment.input'
import { PostCommentResponse } from '../models/postComment.response'
import { PostApplicationInput } from '../models/postApplication.input'
import { UseGuards } from '@nestjs/common'

@Scopes(ApiScope.internal)
@UseGuards(IdsUserGuard, ScopesGuard)
@FeatureFlag(Features.officialJournalOfIceland)
@Resolver()
export class OfficialJournalOfIcelandApplicationResolver {
  constructor(
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationService,
  ) {}

  @Query(() => GetCommentsResponse, {
    name: 'officialJournalOfIcelandApplicationGetComments',
  })
  async getComments(@Args('input') input: GetCommentsInput) {
    return await this.ojoiApplicationService.getComments(input)
  }

  @Query(() => PostCommentResponse, {
    name: 'officialJournalOfIcelandApplicationPostComment',
  })
  async postComment(@Args('input') input: PostCommentInput) {
    return await this.ojoiApplicationService.postComment(input)
  }

  @Query(() => Boolean, {
    name: 'officialJournalOfIcelandApplicationPostApplication',
  })
  async postApplication(@Args('input') input: PostApplicationInput) {
    return await this.ojoiApplicationService.postApplication(input)
  }
}
