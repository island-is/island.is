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
import {
  GetMyUserInfoResponse,
  GetUserInvolvedPartiesResponse,
} from '../models/getUserInvolvedParties.response'
import { GetUserInvolvedPartiesInput } from '../models/getUserInvolvedParties.input'
import { OJOIAIdInput } from '../models/id.input'
import { OJOIAApplicationCaseResponse } from '../models/applicationCase.response'
import { GetPdfResponse } from '../models/getPdf.response'
import { GetInvolvedPartySignaturesInput } from '../models/getInvolvedPartySignatures.input'
import { GetInvolvedPartySignature } from '../models/getInvolvedPartySignatures.response'
import { OJOIApplicationAdvertTemplateTypesResponse } from '../models/applicationAdvertTemplateTypes.response'
import { OJOIApplicationAdvertTemplateResponse } from '../models/applicationAdvertTemplate.response'
import { GetAdvertTemplateInput } from '../models/getAdvertTemplate.input'
import graphqlTypeJson from 'graphql-type-json'
import {
  OJOIARegulationOptionSearchResponse,
  OJOIADraftImpactsResponse,
  OJOIALawChaptersResponse,
  OJOIAMinistriesResponse,
  OJOIACreateDraftResponse,
} from '../models/regulation.response'
import { OJOIAGetRegulationsSearchInput } from '../models/getRegulationsSearch.input'
import { OJOIAGetRegulationFromApiInput } from '../models/getRegulationFromApi.input'
import { OJOIAGetRegulationImpactsInput } from '../models/getRegulationImpacts.input'
import { OJOIACreateDraftRegulationInput } from '../models/createDraftRegulation.input'
import { OJOIAUpdateDraftRegulationInput } from '../models/updateDraftRegulation.input'
import { OJOIAGetDraftRegulationInput } from '../models/getDraftRegulation.input'
import {
  OJOIACreateDraftImpactInput,
  OJOIAUpdateDraftImpactInput,
  OJOIADeleteDraftImpactInput,
} from '../models/draftImpact.input'

@Scopes(ApiScope.ojoiAdverts, ApiScope.internal)
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

  @Query(() => GetPdfResponse, {
    name: 'OJOIAGetPdf',
  })
  getPdf(@Args('input') input: OJOIAIdInput, @CurrentUser() user: User) {
    return this.ojoiApplicationService.getPdf(input, user)
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

  @Query(() => OJOIApplicationAdvertTemplateResponse, {
    name: 'officialJournalOfIcelandApplicationAdvertTemplate',
  })
  getAdvertTemplate(
    @Args('input', { type: () => GetAdvertTemplateInput })
    input: GetAdvertTemplateInput,
    @CurrentUser()
    user: User,
  ) {
    return this.ojoiApplicationService.getAdvertTemplate(input, user)
  }

  @Query(() => OJOIApplicationAdvertTemplateTypesResponse, {
    name: 'officialJournalOfIcelandApplicationAdvertTemplateTypes',
  })
  getAdvertTemplateTypes(@CurrentUser() user: User) {
    return this.ojoiApplicationService.getAdvertTemplateTypes(user)
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

  @Query(() => GetMyUserInfoResponse, {
    name: 'officialJournalOfIcelandApplicationGetMyUserInfo',
  })
  getMyUserInfo(@CurrentUser() user: User) {
    return this.ojoiApplicationService.getMyUserInfo(user)
  }

  @Query(() => OJOIAApplicationCaseResponse, {
    name: 'OJOIAGetApplicationCase',
  })
  getApplicationCase(
    @Args('input') input: OJOIAIdInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getApplicationCase(input.id, user)
  }

  @Mutation(() => Boolean, {
    name: 'OJOIAPostApplication',
  })
  postApplication(
    @Args('input') input: OJOIAIdInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.postApplication(input, user)
  }

  @Query(() => GetInvolvedPartySignature, {
    name: 'officialJournalOfIcelandApplicationInvolvedPartySignature',
  })
  getInvolvedPartySignatures(
    @Args('input') input: GetInvolvedPartySignaturesInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getInvolvedPartySignatures(input, user)
  }

  // ---- Regulation-related queries ----

  @Query(() => OJOIARegulationOptionSearchResponse, {
    name: 'OJOIAGetRegulationsOptionSearch',
    nullable: true,
  })
  getRegulationsOptionSearch(
    @Args('input') input: OJOIAGetRegulationsSearchInput,
  ) {
    return this.ojoiApplicationService.getRegulationsOptionSearch(input)
  }

  @Query(() => graphqlTypeJson, {
    name: 'OJOIAGetRegulationFromApi',
    nullable: true,
  })
  getRegulationFromApi(@Args('input') input: OJOIAGetRegulationFromApiInput) {
    return this.ojoiApplicationService.getRegulationFromApi(input)
  }

  @Query(() => OJOIADraftImpactsResponse, {
    name: 'OJOIAGetRegulationImpactsByName',
    nullable: true,
  })
  getRegulationImpactsByName(
    @Args('input') input: OJOIAGetRegulationImpactsInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getRegulationImpactsByName(
      input.regulation,
      user,
    )
  }

  @Query(() => OJOIALawChaptersResponse, {
    name: 'OJOIAGetLawChapters',
    nullable: true,
  })
  getLawChapters() {
    return this.ojoiApplicationService.getLawChapters()
  }

  @Query(() => OJOIAMinistriesResponse, {
    name: 'OJOIAGetMinistries',
    nullable: true,
  })
  getMinistries() {
    return this.ojoiApplicationService.getMinistries()
  }

  @Mutation(() => OJOIACreateDraftResponse, {
    name: 'OJOIACreateDraftRegulation',
    nullable: true,
  })
  createDraftRegulation(
    @Args('input') input: OJOIACreateDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.createDraftRegulation(input.type, user)
  }

  @Query(() => graphqlTypeJson, {
    name: 'OJOIAGetDraftRegulation',
    nullable: true,
  })
  getDraftRegulation(
    @Args('input') input: OJOIAGetDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.getDraftRegulation(input.draftId, user)
  }

  @Mutation(() => Boolean, {
    name: 'OJOIAUpdateDraftRegulation',
  })
  updateDraftRegulation(
    @Args('input') input: OJOIAUpdateDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.updateDraftRegulation(
      input.draftId,
      {
        title: input.title,
        text: input.text,
        appendixes: input.appendixes,
        draftingNotes: input.draftingNotes,
        idealPublishDate: input.idealPublishDate,
        effectiveDate: input.effectiveDate,
        ministry: input.ministry,
        signatureDate: input.signatureDate,
        signatureText: input.signatureText,
        lawChapters: input.lawChapters,
        fastTrack: input.fastTrack,
        type: input.type,
        signedDocumentUrl: input.signedDocumentUrl,
      },
      user,
    )
  }

  @Mutation(() => OJOIACreateDraftResponse, {
    name: 'OJOIACreateDraftImpact',
    nullable: true,
  })
  createDraftImpact(
    @Args('input') input: OJOIACreateDraftImpactInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.createDraftImpact(
      {
        draftId: input.draftId,
        type: input.type as 'amend' | 'repeal',
        regulation: input.regulation,
        date: input.date,
        title: input.title,
        text: input.text,
        appendixes: input.appendixes,
        comments: input.comments,
        diff: input.diff,
      },
      user,
    )
  }

  @Mutation(() => Boolean, {
    name: 'OJOIAUpdateDraftImpact',
  })
  updateDraftImpact(
    @Args('input') input: OJOIAUpdateDraftImpactInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.updateDraftImpact(
      {
        impactId: input.impactId,
        type: input.type as 'amend' | 'repeal',
        date: input.date,
        title: input.title,
        text: input.text,
        appendixes: input.appendixes,
        comments: input.comments,
        diff: input.diff,
      },
      user,
    )
  }

  @Mutation(() => Boolean, {
    name: 'OJOIADeleteDraftImpact',
  })
  deleteDraftImpact(
    @Args('input') input: OJOIADeleteDraftImpactInput,
    @CurrentUser() user: User,
  ) {
    return this.ojoiApplicationService.deleteDraftImpact(
      input.impactId,
      input.type as 'amend' | 'repeal',
      user,
    )
  }
}
