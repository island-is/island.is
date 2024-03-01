import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  User,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { AuditService } from '@island.is/nest/audit'
import { DocumentsScope } from '@island.is/auth/scopes'
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql'
import { DocumentService } from './document.service'
import { Document, PaginatedDocuments } from './models/document.model'
import { DocumentInput } from './models/document.input'
import { DocumentsInput } from './models/listDocuments.input'
import { Type } from './models/type.model'
import { Sender } from './models/sender.model'
import { Category } from './models/category.model'
import { PaperMailPreferences } from './models/paperMailPreferences.model'
import { BulkMailActionInput } from './models/bulkMailAction.input'
import { PostMailAction } from './models/postMailAction.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentResolver {
  constructor(
    private documentService: DocumentService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(DocumentsScope.main)
  @Query(() => Document, { nullable: true })
  async documentV2(
    @Args('input') input: DocumentInput,
    @CurrentUser() user: User,
  ): Promise<Document | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace: '@island.is/api/document-v2',
        action: 'getDocument',
        resources: input.id,
      },
      this.documentService.findDocumentById(user.nationalId, input.id),
    )
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaginatedDocuments, { nullable: true })
  async documentsV2(
    @Args('input') input: DocumentsInput,
    @CurrentUser() user: User,
  ): Promise<PaginatedDocuments | null> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace: '@island.is/api/document-v2',
        action: 'listDocuments',
      },
      this.documentService.listDocuments(user.nationalId, input),
    )
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [Type], { nullable: true })
  documentsV2Type(@CurrentUser() user: User): Promise<Array<Type> | null> {
    return this.documentService.getTypes(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [Sender], { nullable: true })
  documentsV2Senders(@CurrentUser() user: User): Promise<Array<Sender> | null> {
    return this.documentService.getSenders(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => [Category], { nullable: true })
  documentsV2Categories(
    @CurrentUser() user: User,
  ): Promise<Array<Category> | null> {
    return this.documentService.getCategories(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaperMailPreferences, { nullable: true })
  documentsV2PaperMailPreferences(
    @CurrentUser() user: User,
  ): Promise<PaperMailPreferences | null> {
    return this.documentService.getPaperMailInfo(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => PaperMailPreferences, { nullable: true })
  documentsV2UpdatePaperMailPreferences(
    @CurrentUser() user: User,
    @Args('wantsPaper') wantsPaper: boolean,
  ): Promise<PaperMailPreferences | null> {
    return this.documentService.postPaperMailInfo(user.nationalId, wantsPaper)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => PostMailAction)
  async documentsV2PostMailAction(
    @CurrentUser() user: User,
    @Args('input') input: BulkMailActionInput,
  ): Promise<PostMailAction> {
    await this.documentService.postMailAction(
      user.nationalId,
      input.documentIds,
      input.action,
    )

    return {
      documentIds: input.documentIds,
    }
  }
}
