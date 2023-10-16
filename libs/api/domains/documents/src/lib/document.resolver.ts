import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import { AuditService } from '@island.is/nest/audit'

import { DocumentService } from './document.service'
import { Document, DocumentListResponse } from './models/document.model'
import { GetDocumentInput } from './dto/getDocumentInput'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentType } from './models/documentType.model'

import { GetDocumentListInput } from './dto/getDocumentListInput'
import { DocumentSender } from './models/documentSender.model'
import { PaperMailBody } from './models/paperMail.model'
import { PostRequestPaperInput } from './dto/postRequestPaperInput'
import { PostMailActionResolverInput } from './dto/postMailActionInput'
import { ActionMailBody } from './models/actionMail.model'
import { PostBulkMailActionResolverInput } from './dto/postBulkMailActionInput'
import { BulkMailAction } from './models/bulkMailAction.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentResolver {
  constructor(
    private documentService: DocumentService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentDetails, { nullable: true })
  async getDocument(
    @Args('input') input: GetDocumentInput,
    @CurrentUser() user: User,
  ): Promise<DocumentDetails> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace: '@island.is/api/document',
        action: 'getDocument',
        resources: input.id,
      },
      this.documentService.findByDocumentId(user.nationalId, input.id),
    )
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [Document], { nullable: true })
  listDocuments(@CurrentUser() user: User): Promise<Array<Document>> {
    return this.documentService.listDocuments(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentListResponse, { nullable: true })
  listDocumentsV2(
    @Args('input') input: GetDocumentListInput,
    @CurrentUser() user: User,
  ): Promise<DocumentListResponse> {
    return this.documentService.listDocumentsV2(user.nationalId, input)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [DocumentCategory], { nullable: true })
  getDocumentCategories(
    @CurrentUser() user: User,
  ): Promise<DocumentCategory[]> {
    return this.documentService.getCategories(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [DocumentType], { nullable: true })
  getDocumentTypes(@CurrentUser() user: User): Promise<DocumentType[]> {
    return this.documentService.getTypes(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [DocumentSender], { nullable: true })
  getDocumentSenders(@CurrentUser() user: User): Promise<DocumentSender[]> {
    return this.documentService.getSenders(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaperMailBody, { nullable: true })
  getPaperMailInfo(@CurrentUser() user: User): Promise<PaperMailBody> {
    return this.documentService.getPaperMailInfo(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => PaperMailBody, { nullable: true })
  postPaperMailInfo(
    @CurrentUser() user: User,
    @Args('input') input: PostRequestPaperInput,
  ): Promise<PaperMailBody> {
    return this.documentService.postPaperMailInfo(user.nationalId, input)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => ActionMailBody, { nullable: true })
  postMailAction(
    @CurrentUser() user: User,
    @Args('input') input: PostMailActionResolverInput,
  ): Promise<ActionMailBody> {
    return this.documentService.postMailAction({
      ...input,
      nationalId: user.nationalId,
    })
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => BulkMailAction, { nullable: true })
  postBulkMailAction(
    @CurrentUser() user: User,
    @Args('input') input: PostBulkMailActionResolverInput,
  ): Promise<BulkMailAction> {
    return this.documentService.bulkMailAction({
      ...input,
      nationalId: user.nationalId,
    })
  }
}
