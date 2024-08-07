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
import { CaseGetPriceResponse } from '../models/getPrice.response'
import { GetPdfUrlResponse } from '../models/getPdfUrlResponse'
import { GetPdfResponse } from '../models/getPdfResponse'

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

  @Query(() => CaseGetPriceResponse, {
    name: 'officialJournalOfIcelandApplicationGetPrice',
  })
  async getPrice(@Args('id') id: string) {
    return await this.ojoiApplicationService.getPrice(id)
  }

  @Query(() => GetPdfUrlResponse, {
    name: 'officialJournalOfIcelandApplicationGetPdfUrl',
  })
  async getPdfUrl(@Args('id') id: string) {
    return await this.ojoiApplicationService.getPdfUrl(id)
  }

  @Query(() => GetPdfResponse, {
    name: 'officialJournalOfIcelandApplicationGetPdf',
  })
  async getPdf(@Args('id') id: string) {
    return (await this.ojoiApplicationService.getPdf(id)).toString('base64')
  }
}
