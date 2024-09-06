import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
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
import { GetPresignedUrlInput } from '../models/getPresignedUrl.input'
import { GetPresignedUrlResponse } from '../models/getPresignedUrl.response'
import { AddApplicationAttachmentResponse } from '../models/addApplicationAttachment.response'
import { AddApplicationAttachmentInput } from '../models/addApplicationAttachment.input'
import { GetApplicationAttachmentInput } from '../models/getApplicationAttachment.input'
import { GetApplicationAttachmentsResponse } from '../models/getApplicationAttachments.response'
import { DeleteApplicationAttachmentInput } from '../models/deleteApplicationAttachment.input'

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
  getComments(@Args('input') input: GetCommentsInput) {
    return this.ojoiApplicationService.getComments(input)
  }

  @Mutation(() => PostCommentResponse, {
    name: 'officialJournalOfIcelandApplicationPostComment',
  })
  postComment(@Args('input') input: PostCommentInput) {
    return this.ojoiApplicationService.postComment(input)
  }

  @Query(() => Boolean, {
    name: 'officialJournalOfIcelandApplicationPostApplication',
  })
  postApplication(@Args('input') input: PostApplicationInput) {
    return this.ojoiApplicationService.postApplication(input)
  }

  @Query(() => CaseGetPriceResponse, {
    name: 'officialJournalOfIcelandApplicationGetPrice',
  })
  getPrice(@Args('id') id: string) {
    return this.ojoiApplicationService.getPrice(id)
  }

  @Query(() => GetPdfUrlResponse, {
    name: 'officialJournalOfIcelandApplicationGetPdfUrl',
  })
  getPdfUrl(@Args('id') id: string) {
    return this.ojoiApplicationService.getPdfUrl(id)
  }

  getPdf(@Args('id') id: string) {
    return this.ojoiApplicationService.getPdf(id)
  }

  @Mutation(() => GetPresignedUrlResponse, {
    name: 'officialJournalOfIcelandApplicationGetPresignedUrl',
  })
  getPresignedUrl(
    @Args('input', { type: () => GetPresignedUrlInput })
    input: GetPresignedUrlInput,
  ) {
    return this.ojoiApplicationService.getPresignedUrl(input)
  }

  @Mutation(() => AddApplicationAttachmentResponse, {
    name: 'officialJournalOfIcelandApplicationAddAttachment',
  })
  addAttachment(
    @Args('input', { type: () => AddApplicationAttachmentInput })
    input: AddApplicationAttachmentInput,
  ) {
    return this.ojoiApplicationService.addApplicationAttachment(input)
  }

  @Query(() => GetApplicationAttachmentsResponse, {
    name: 'officialJournalOfIcelandApplicationGetAttachments',
  })
  getAttachments(
    @Args('input', { type: () => GetApplicationAttachmentInput })
    input: AddApplicationAttachmentInput,
  ) {
    return this.ojoiApplicationService.getApplicationAttachments(input)
  }

  @Mutation(() => AddApplicationAttachmentResponse, {
    name: 'officialJournalOfIcelandApplicationDeleteAttachment',
  })
  deleteAttachment(
    @Args('input', { type: () => DeleteApplicationAttachmentInput })
    input: DeleteApplicationAttachmentInput,
  ) {
    return this.ojoiApplicationService.deleteApplicationAttachment(input)
  }
}
