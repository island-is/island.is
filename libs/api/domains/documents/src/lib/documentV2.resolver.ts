import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards, Inject } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import { AuditService } from '@island.is/nest/audit'

import {
  DocumentPageNumber,
  Document as DocumentV2,
  PaginatedDocuments,
} from './models/v2/document.model'

import { PostRequestPaperInput } from './dto/postRequestPaperInput'
import { DocumentInput } from './models/v2/document.input'
import { DocumentServiceV2 } from './documentV2.service'
import { DocumentsInput } from './models/v2/documents.input'
import { Category } from './models/v2/category.model'
import { Type } from './models/v2/type.model'
import { Sender } from './models/v2/sender.model'
import { PaperMailPreferences } from './models/v2/paperMailPreferences.model'
import { MailActionInput } from './models/v2/bulkMailAction.input'
import { DocumentMailAction } from './models/v2/mailAction.model.'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const LOG_CATEGORY = 'documents-resolver'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => PaginatedDocuments)
export class DocumentResolverV2 {
  constructor(
    private documentServiceV2: DocumentServiceV2,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentV2, { nullable: true, name: 'documentV2' })
  async documentV2(
    @Args('input') input: DocumentInput,
    @CurrentUser() user: User,
  ): Promise<DocumentV2 | null> {
    try {
      return await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-v2',
          action: 'getDocument',
          resources: input.id,
        },
        this.documentServiceV2.findDocumentById(user.nationalId, input.id),
      )
    } catch (e) {
      this.logger.error('failed to get single document', {
        category: LOG_CATEGORY,
        provider: input.provider,
        error: e,
      })
      throw e
    }
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaginatedDocuments, { nullable: true })
  documentsV2(
    @Args('input') input: DocumentsInput,
    @CurrentUser() user: User,
  ): Promise<PaginatedDocuments> {
    return this.documentServiceV2.listDocuments(user.nationalId, input)
  }

  @ResolveField('categories', () => [Category])
  documentCategories(@CurrentUser() user: User): Promise<Array<Category>> {
    return this.documentServiceV2.getCategories(user.nationalId)
  }

  @ResolveField('senders', () => [Sender])
  documentSenders(@CurrentUser() user: User): Promise<Array<Sender>> {
    return this.documentServiceV2.getSenders(user.nationalId)
  }

  @ResolveField('types', () => [Type])
  documentTypes(@CurrentUser() user: User): Promise<Array<Type>> {
    return this.documentServiceV2.getTypes(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentPageNumber, { nullable: true })
  documentPageNumber(
    @CurrentUser() user: User,
    @Args('input') input: DocumentInput,
  ): Promise<DocumentPageNumber | null> {
    return this.documentServiceV2.getPageNumber(
      user.nationalId,
      input.id,
      input.pageSize,
    )
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaperMailPreferences, { nullable: true })
  getPaperMailInfo(
    @CurrentUser() user: User,
  ): Promise<PaperMailPreferences | null> {
    return this.documentServiceV2.getPaperMailInfo(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => PaperMailPreferences, { nullable: true })
  postPaperMailInfo(
    @CurrentUser() user: User,
    @Args('input') input: PostRequestPaperInput,
  ): Promise<PaperMailPreferences | null> {
    return this.documentServiceV2.postPaperMailInfo(
      user.nationalId,
      input.wantsPaper,
    )
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => DocumentMailAction, {
    nullable: true,
    name: 'postMailActionV2',
  })
  async postMailAction(
    @CurrentUser() user: User,
    @Args('input') input: MailActionInput,
  ): Promise<DocumentMailAction | null> {
    if (input.documentIds.length === 0) {
      this.logger.warn('No document ids provided for posting action', {
        category: LOG_CATEGORY,
        action: input.action,
      })
      return null
    }

    const ids =
      input.documentIds.length === 1 ? input.documentIds[0] : input.documentIds

    try {
      return await this.documentServiceV2.postMailAction(
        user.nationalId,
        ids,
        input.action,
      )
    } catch (e) {
      this.logger.error('failed to post document action', {
        category: LOG_CATEGORY,
        action: input.action,
        error: e,
      })
      throw e
    }
  }
}
