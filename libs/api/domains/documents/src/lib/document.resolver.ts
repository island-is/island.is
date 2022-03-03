import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { DocumentsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'

import { GetDocumentInput } from './dto/getDocumentInput'
import { Document } from './models/document.model'
import { DocumentCategory } from './models/documentCategory.model'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentService } from './document.service'

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
  listDocuments(@CurrentUser() user: User): Promise<Document[]> {
    return this.documentService.listDocuments(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [DocumentCategory], { nullable: true })
  getDocumentCategories(
    @CurrentUser() user: User,
  ): Promise<DocumentCategory[]> {
    return this.documentService.getCategories(user.nationalId)
  }
}
