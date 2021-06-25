import { Args, Query, Resolver } from '@nestjs/graphql'
import { DocumentService } from './document.service'
import { Document } from './models/document.model'
import { GetDocumentInput } from './dto/getDocumentInput'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { AuditService } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentResolver {
  constructor(
    private documentService: DocumentService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => DocumentDetails, { nullable: true })
  async getDocument(
    @Args('input') input: GetDocumentInput,
    @CurrentUser() user: User,
  ): Promise<DocumentDetails> {
    return this.auditService.auditPromise(
      {
        user,
        namespace: '@island.is/api/document',
        action: 'getDocument',
        resources: input.id,
      },
      this.documentService.findByDocumentId(user.nationalId, input.id),
    )
  }

  @Query(() => [Document], { nullable: true })
  listDocuments(@CurrentUser() user: User): Promise<Document[]> {
    return this.documentService.listDocuments(user.nationalId)
  }

  @Query(() => [DocumentCategory], { nullable: true })
  getDocumentCategories(
    @CurrentUser() user: User,
  ): Promise<DocumentCategory[]> {
    return this.documentService.getCategories(user.nationalId)
  }
}
