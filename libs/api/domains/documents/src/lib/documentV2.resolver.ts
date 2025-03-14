import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards, Inject } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import { AuditService, Audit } from '@island.is/nest/audit'

import {
  DocumentPageNumber,
  Document as DocumentV2,
  PaginatedDocuments,
} from './models/v2/document.model'
import {
  FeatureFlagGuard,
  FeatureFlagService,
} from '@island.is/nest/feature-flags'
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
import { DocumentV2MarkAllMailAsRead } from './models/v2/markAllMailAsRead.model'
import type { Locale } from '@island.is/shared/types'
import { DocumentConfirmActionsInput } from './models/v2/confirmActions.input'
import { DocumentConfirmActions } from './models/v2/confirmActions.model'
import { isDefined } from '@island.is/shared/utils'
import {
  DocumentPdfRenderer,
  DocumentPdfRendererInput,
} from './models/v2/pdfRenderer.model'

const LOG_CATEGORY = 'documents-resolver'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => PaginatedDocuments)
@Audit({ namespace: '@island.is/api/document-v2' })
export class DocumentResolverV2 {
  constructor(
    private documentServiceV2: DocumentServiceV2,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentV2, { nullable: true, name: 'documentV2' })
  async documentV2(
    @Args('input') input: DocumentInput,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<DocumentV2 | null> {
    const isCourtCase = input.category === 'Dómsmál'
    try {
      const data = await this.auditService.auditPromise(
        {
          auth: user,
          namespace: '@island.is/api/document-v2',
          action: 'getDocument',
          resources: input.id,
          meta: { includeDocument: input.includeDocument },
        },
        this.documentServiceV2.findDocumentById(
          user.nationalId,
          input.id,
          locale,
          input.includeDocument,
        ),
      )
      if (isCourtCase) {
        this.logger.info('Court case document fetched successfully', {
          category: LOG_CATEGORY,
          documentId: input.id,
          includeDocument: input.includeDocument,
          provider: input.provider,
          documentCategory: input.category,
          isCourtCase: true,
        })
      }
      return data
    } catch (e) {
      this.logger.warn('Failed to get single document', {
        category: LOG_CATEGORY,
        provider: input.provider,
        documentCategory: input.category,
        isCourtCase: isCourtCase,
        error: e,
      })
      throw e
    }
  }

  @Scopes(DocumentsScope.main)
  @Query(() => PaginatedDocuments, { nullable: true })
  @Audit()
  async documentsV2(
    @Args('input') input: DocumentsInput,
    @CurrentUser() user: User,
  ): Promise<PaginatedDocuments> {
    return this.documentServiceV2.listDocuments(user, input)
  }

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentConfirmActions, {
    nullable: true,
    name: 'documentV2ConfirmActions',
  })
  async confirmActions(
    @Args('input') input: DocumentConfirmActionsInput,
    @CurrentUser() user: User,
  ) {
    this.auditService.audit({
      auth: user,
      namespace: '@island.is/api/document-v2',
      action: 'confirmModal',
      resources: input.id,
      meta: { confirmed: input.confirmed },
    })
    this.logger.info('confirming urgent document modal', {
      category: LOG_CATEGORY,
      id: input.id,
      confirmed: input.confirmed,
    })
    return { id: input.id, confirmed: input.confirmed }
  }

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentPdfRenderer, {
    nullable: true,
    name: 'documentV2PdfRenderer',
  })
  async pdfRenderer(
    @Args('input') input: DocumentPdfRendererInput,
    @CurrentUser() user: User,
  ) {
    this.auditService.audit({
      auth: user,
      namespace: '@island.is/api/document-v2',
      action: 'pdfRenderer',
      resources: input.id,
      meta: { success: input.success },
    })
    if (!input.success) {
      this.logger.error('failed to render document pdf', {
        category: LOG_CATEGORY,
        id: input.id,
        success: input.success,
      })
    } else {
      this.logger.info('rendered document pdf', {
        category: LOG_CATEGORY,
        id: input.id,
        success: input.success,
      })
    }

    return { id: input.id, success: input.success }
  }

  @ResolveField('categories', () => [Category])
  async documentCategories(
    @CurrentUser() user: User,
  ): Promise<Array<Category>> {
    const categories = await this.documentServiceV2.getCategories(user)
    if (!isDefined(categories)) {
      return []
    } else return categories
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
  @Audit()
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
  @Mutation(() => DocumentV2MarkAllMailAsRead, {
    nullable: true,
    name: 'documentsV2MarkAllAsRead',
  })
  @Audit()
  markAllMailAsRead(
    @CurrentUser() user: User,
  ): Promise<DocumentV2MarkAllMailAsRead> {
    return this.documentServiceV2.markAllMailAsRead(user.nationalId)
  }

  @Scopes(DocumentsScope.main)
  @Mutation(() => DocumentMailAction, {
    nullable: true,
    name: 'postMailActionV2',
  })
  @Audit()
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
      this.logger.info('failed to post document action', {
        category: LOG_CATEGORY,
        action: input.action,
        error: e,
      })
      throw e
    }
  }
}
