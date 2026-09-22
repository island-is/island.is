import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  SharedNamespaceIntrospectionService,
  TemplateIntrospectionService,
  TranslationAccessService,
  type ContentfulTranslationRow,
} from '@island.is/application/api/core'
import { getAllowedTranslationTypeIds } from '@island.is/application/utils'
import { CmsTranslationCacheService } from '@island.is/cms-translations'
import { ApplicationTypes } from '@island.is/application/types'
import { Audit } from '@island.is/nest/audit'
import { BulkUpdateTranslationsDto } from './dto/translation.dto'
import {
  ApplicationTranslationService,
  type PublishHistoryItem,
} from './application-translation.service'

const TRANSLATION_SCOPES = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
] as const

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('translations')
@ApiBearerAuth()
@Audit({ namespace: '@island.is/applications/translations' })
@Controller('admin/translations')
export class TranslationController {
  constructor(
    private readonly translationService: ApplicationTranslationService,
    private readonly introspectionService: TemplateIntrospectionService,
    private readonly sharedNamespaceIntrospectionService: SharedNamespaceIntrospectionService,
    private readonly translationAccessService: TranslationAccessService,
    private readonly translationCacheService: CmsTranslationCacheService,
  ) {}

  @Scopes(...TRANSLATION_SCOPES)
  @Get('templates/list')
  async listTemplates(@CurrentUser() user: User) {
    const allowedTypeIds = getAllowedTranslationTypeIds(user) ?? undefined
    return this.introspectionService.listTemplates(allowedTypeIds)
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get('templates/:typeId/introspect')
  async introspectTemplate(
    @CurrentUser() user: User,
    @Param('typeId') typeId: string,
  ) {
    this.translationAccessService.assertTypeIdAccess(user, typeId)
    return this.introspectionService.introspectTemplate(
      typeId as ApplicationTypes,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get('templates/:typeId/form')
  async loadRoleForm(
    @CurrentUser() user: User,
    @Param('typeId') typeId: string,
    @Query('stateKey') stateKey: string,
    @Query('roleId') roleId: string,
  ) {
    this.translationAccessService.assertTypeIdAccess(user, typeId)

    if (!stateKey?.trim() || !roleId?.trim()) {
      throw new BadRequestException(
        'Query parameters stateKey and roleId are required',
      )
    }
    return this.introspectionService.loadRoleForm(
      typeId as ApplicationTypes,
      stateKey,
      roleId,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get('shared/list')
  async listSharedNamespaces(@CurrentUser() user: User) {
    this.translationAccessService.assertGlobalTranslationAccess(user)
    return this.sharedNamespaceIntrospectionService.listSharedNamespaces()
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get('shared/introspect')
  async introspectSharedNamespace(
    @CurrentUser() user: User,
    @Query('namespace') namespace: string,
  ) {
    if (!namespace?.trim()) {
      throw new BadRequestException('Query parameter namespace is required')
    }

    this.translationAccessService.assertGlobalTranslationAccess(user)
    return this.sharedNamespaceIntrospectionService.introspectSharedNamespace(
      namespace,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Audit<ContentfulTranslationRow[]>({
    action: 'save',
    resources: (rows) => [...new Set(rows.map((row) => row.namespace))],
  })
  @Post('bulk')
  async bulkUpdateTranslations(
    @Body() body: BulkUpdateTranslationsDto,
    @CurrentUser() user: User,
  ) {
    const namespaces = [
      ...new Set(body.translations.map((translation) => translation.namespace)),
    ]
    for (const namespace of namespaces) {
      this.translationAccessService.assertNamespaceWriteAccess(user, namespace)
    }

    return this.translationService.bulkUpsertTranslations(
      body.translations,
      user,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get(':namespace/all')
  async getAllTranslations(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)
    return this.translationService.getTranslationsByNamespace(namespace)
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get(':namespace/publish-history')
  async getPublishHistory(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)
    return this.translationService.getPublishHistory(namespace)
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Audit<PublishHistoryItem>({
    action: 'publish',
    resources: (result) => result.namespace,
  })
  @Post(':namespace/publish')
  async publishTranslations(
    @Param('namespace') namespace: string,
    @CurrentUser() user: User,
  ) {
    this.translationAccessService.assertNamespaceWriteAccess(user, namespace)

    const publish = await this.translationService.publishTranslations(
      namespace,
      user,
    )

    await this.translationCacheService.invalidate(namespace)

    return publish
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Audit<PublishHistoryItem>({
    action: 'rollback',
    resources: (result) => result.namespace,
  })
  @Post(':namespace/rollback/:publishId')
  async rollbackTranslations(
    @Param('namespace') namespace: string,
    @Param('publishId') publishId: string,
    @CurrentUser() user: User,
  ) {
    this.translationAccessService.assertNamespaceWriteAccess(user, namespace)

    const rollback = await this.translationService.rollbackToPublish(
      publishId,
      namespace,
      user,
    )

    if (!rollback) {
      throw new NotFoundException('Publish version not found')
    }

    await this.translationCacheService.invalidate(namespace)

    return rollback
  }
}
