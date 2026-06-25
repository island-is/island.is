import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
  ApplicationTranslationService,
  SharedNamespaceIntrospectionService,
  TemplateIntrospectionService,
  TranslationAccessService,
} from '@island.is/application/api/core'
import { getAllowedTranslationTypeIds } from '@island.is/application/utils'
import { CmsTranslationsService } from '@island.is/cms-translations'
import { ApplicationTypes } from '@island.is/application/types'
import type { Locale } from '@island.is/shared/types'
import {
  UpdateTranslationDto,
  BulkUpdateTranslationsDto,
  PublishTranslationsDto,
} from './dto/translation.dto'

const TRANSLATION_SCOPES = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
] as const

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('translations')
@ApiBearerAuth()
@Controller('admin/translations')
export class TranslationController {
  constructor(
    private readonly translationService: ApplicationTranslationService,
    private readonly introspectionService: TemplateIntrospectionService,
    private readonly sharedNamespaceIntrospectionService: SharedNamespaceIntrospectionService,
    private readonly translationAccessService: TranslationAccessService,
    private readonly cmsTranslationsService: CmsTranslationsService,
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

    this.translationAccessService.assertNamespaceAccess(user, namespace)
    return this.sharedNamespaceIntrospectionService.introspectSharedNamespace(
      namespace,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get()
  async getAllNamespacesWithStatus(@CurrentUser() user: User) {
    const statuses = await this.translationService.getAllNamespacesWithStatus()
    const allowedNamespaces = this.translationAccessService.filterNamespaces(
      user,
      statuses.map((status) => status.namespace),
    )
    const allowedSet = new Set(allowedNamespaces)
    return statuses.filter((status) => allowedSet.has(status.namespace))
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Put()
  async updateTranslation(
    @Body() body: UpdateTranslationDto,
    @CurrentUser() user: User,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, body.namespace)

    return this.translationService.upsertTranslation(
      {
        namespace: body.namespace,
        messageKey: body.messageKey,
        valueIs: body.valueIs,
        valueEn: body.valueEn,
      },
      user.nationalId,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Post('bulk')
  async bulkUpdateTranslations(
    @Body() body: BulkUpdateTranslationsDto,
    @CurrentUser() user: User,
  ) {
    const namespaces = [
      ...new Set(body.translations.map((translation) => translation.namespace)),
    ]
    for (const namespace of namespaces) {
      this.translationAccessService.assertNamespaceAccess(user, namespace)
    }

    return this.translationService.bulkUpsertTranslations(
      body.translations,
      user.nationalId,
    )
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Post(':id/review')
  async reviewTranslation(@Param('id') id: string, @CurrentUser() user: User) {
    const translation = await this.translationService.getTranslationById(id)
    if (!translation) {
      throw new NotFoundException('Translation not found')
    }

    this.translationAccessService.assertNamespaceAccess(
      user,
      translation.namespace,
    )

    return this.translationService.markAsReviewed(id, user.nationalId)
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
  @Get(':namespace/status')
  async getTranslationStatus(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)
    return this.translationService.getTranslationStatus(namespace)
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
  @Post(':namespace/publish')
  async publishTranslations(
    @Param('namespace') namespace: string,
    @Body() body: PublishTranslationsDto,
    @CurrentUser() user: User,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)

    const publish = await this.translationService.publishTranslations(
      namespace,
      user.nationalId,
      body.note,
      user.actor?.nationalId,
    )

    await this.cmsTranslationsService.invalidateApplicationTranslationCache(
      namespace,
    )

    return publish
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Post(':namespace/rollback/:publishId')
  async rollbackTranslations(
    @Param('namespace') namespace: string,
    @Param('publishId') publishId: string,
    @CurrentUser() user: User,
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)

    const rollback = await this.translationService.rollbackToPublish(
      publishId,
      namespace,
      user.nationalId,
      user.actor?.nationalId,
    )

    if (rollback) {
      await this.cmsTranslationsService.invalidateApplicationTranslationCache(
        namespace,
      )
    }

    return rollback
  }

  @Scopes(...TRANSLATION_SCOPES)
  @Get(':namespace')
  async getTranslations(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query('locale') locale: Locale = 'is',
  ) {
    this.translationAccessService.assertNamespaceAccess(user, namespace)
    return this.translationService.getTranslationsForNamespace(
      namespace,
      locale,
    )
  }
}
