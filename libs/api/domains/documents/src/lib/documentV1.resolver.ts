import { Args, Directive, Mutation, Query } from '@nestjs/graphql'
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
import { DocumentService } from './documentV1.service'
import { GetDocumentPageInput } from './dto/documentPageInput'
import { GetDocumentInput } from './dto/getDocumentInput'
import { GetDocumentListInput } from './dto/getDocumentListInput'
import { PostBulkMailActionResolverInput } from './dto/postBulkMailActionInput'
import { PostMailActionResolverInput } from './dto/postMailActionInput'
import { PostRequestPaperInput } from './dto/postRequestPaperInput'
import { ActionMailBody } from './models/v1/actionMail.model'
import { BulkMailAction } from './models/v1/bulkMailAction.model'
import { DocumentListResponse } from './models/v1/document.model'
import { DocumentCategory } from './models/v1/documentCategory.model'
import { DocumentDetails } from './models/v1/documentDetails.model'
import { DocumentPageResponse } from './models/v1/documentPage.model'
import { DocumentSender } from './models/v1/documentSender.model'
import { PaperMailBody } from './models/v1/paperMail.model'
import { Document } from './models/v1/document.model'
import { DocumentType } from './models/v1/documentType.model'

@UseGuards(IdsUserGuard, ScopesGuard)
export class DocumentResolverV1 {
  constructor(
    private documentService: DocumentService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => DocumentDetails, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
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
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => [Document], {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  listDocuments(@CurrentUser() user: User): Promise<Array<Document>> {
    return this.documentService.listDocuments(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => DocumentListResponse, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  listDocumentsV2(
    @Args('input') input: GetDocumentListInput,
    @CurrentUser() user: User,
  ): Promise<DocumentListResponse> {
    return this.documentService.listDocumentsV2(user.nationalId, input)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => [DocumentCategory], {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  getDocumentCategories(
    @CurrentUser() user: User,
  ): Promise<DocumentCategory[]> {
    return this.documentService.getCategories(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => [DocumentType], {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  getDocumentTypes(@CurrentUser() user: User): Promise<DocumentType[]> {
    return this.documentService.getTypes(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => [DocumentSender], {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  getDocumentSenders(@CurrentUser() user: User): Promise<DocumentSender[]> {
    return this.documentService.getSenders(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => DocumentPageResponse, { deprecationReason: 'Up for removal' })
  getDocumentPageNumber(
    @Args('input') input: GetDocumentPageInput,
    @CurrentUser() user: User,
  ): Promise<DocumentPageResponse> {
    return this.documentService.getDocumentPageNumber(input, user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Query(() => PaperMailBody, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  getPaperMailInfo(@CurrentUser() user: User): Promise<PaperMailBody> {
    return this.documentService.getPaperMailInfo(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Mutation(() => PaperMailBody, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
  postPaperMailInfo(
    @CurrentUser() user: User,
    @Args('input') input: PostRequestPaperInput,
  ): Promise<PaperMailBody> {
    return this.documentService.postPaperMailInfo(user.nationalId, input)
  }

  @Scopes(DocumentsScope.main)
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Mutation(() => ActionMailBody, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
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
  @Directive('@deprecated(reson: "Will be removed shortly")')
  @Mutation(() => BulkMailAction, {
    nullable: true,
    deprecationReason: 'Up for removal',
  })
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
