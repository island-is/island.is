import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { OfficialJournalOfIcelandApplicationService } from './ojoiApplication.service'
import { GetCommentsInput } from '../models/getComments.input'
import { GetCommentsResponse } from '../models/getComments.response'
import { PostCommentInput } from '../models/postComment.input'
import { PostCommentResponse } from '../models/postComment.response'
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
import type { User } from '@island.is/auth-nest-tools'
import { GetUserInvolvedPartiesResponse } from '../models/getUserInvolvedParties.response'
import { GetUserInvolvedPartiesInput } from '../models/getUserInvolvedParties.input'

@Scopes(ApiScope.internal)
@UseGuards(IdsUserGuard, ScopesGuard)
@FeatureFlag(Features.officialJournalOfIceland)
@Resolver()
export class OfficialJournalOfIcelandApplicationResolver {
  constructor(
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationService,
  ) {}

  @Query(() => GetCommentsResponse, {
    name: 'OJOIAGetComments',
  })
  getComments(
    @Args('input') input: GetCommentsInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getComments(input, user)
  }

  @Mutation(() => PostCommentResponse, {
    name: 'OJOIAPostComment',
  })
  postComment(
    @Args('input') input: PostCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.postComment(input, user)
  }

  @Query(() => CaseGetPriceResponse, {
    name: 'officialJournalOfIcelandApplicationGetPrice',
  })
  getPrice(@Args('id') id: string, @CurrentUser() user: User) {
    return this.ojoiApplicationService.getPrice(id, user)
  }

  @Query(() => GetPdfUrlResponse, {
    name: 'officialJournalOfIcelandApplicationGetPdfUrl',
  })
  getPdfUrl(@Args('id') id: string, @CurrentUser() user: User) {
    return this.ojoiApplicationService.getPdfUrl(id, user)
  }

  @Mutation(() => GetPresignedUrlResponse, {
    name: 'officialJournalOfIcelandApplicationGetPresignedUrl',
  })
  getPresignedUrl(
    @Args('input', { type: () => GetPresignedUrlInput })
    input: GetPresignedUrlInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getPresignedUrl(input, user)
  }

  @Mutation(() => AddApplicationAttachmentResponse, {
    name: 'officialJournalOfIcelandApplicationAddAttachment',
  })
  addAttachment(
    @Args('input', { type: () => AddApplicationAttachmentInput })
    input: AddApplicationAttachmentInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.addApplicationAttachment(input, user)
  }

  @Query(() => GetApplicationAttachmentsResponse, {
    name: 'officialJournalOfIcelandApplicationGetAttachments',
  })
  getAttachments(
    @Args('input', { type: () => GetApplicationAttachmentInput })
    input: AddApplicationAttachmentInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getApplicationAttachments(input, user)
  }

  @Mutation(() => AddApplicationAttachmentResponse, {
    name: 'officialJournalOfIcelandApplicationDeleteAttachment',
  })
  deleteAttachment(
    @Args('input', { type: () => DeleteApplicationAttachmentInput })
    input: DeleteApplicationAttachmentInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.deleteApplicationAttachment(input, user)
  }

  @Query(() => GetUserInvolvedPartiesResponse, {
    name: 'officialJournalOfIcelandApplicationGetUserInvolvedParties',
  })
  getUserInvolvedParties(
    @Args('input', { type: () => GetUserInvolvedPartiesInput })
    input: GetUserInvolvedPartiesInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getUserInvolvedParties(input, user)
  }
}
