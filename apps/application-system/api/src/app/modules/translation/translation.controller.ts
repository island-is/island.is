import {
  Body,
  Controller,
  Get,
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
  TemplateIntrospectionService,
} from '@island.is/application/api/core'
import { AiTranslateService } from '@island.is/application/api/core'
import { ApplicationTypes } from '@island.is/application/types'
import type { Locale } from '@island.is/shared/types'
import {
  UpdateTranslationDto,
  BulkUpdateTranslationsDto,
} from './dto/translation.dto'
import { AiTranslateDto } from './dto/ai-translate.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('translations')
@ApiBearerAuth()
@Controller('admin/translations')
export class TranslationController {
  constructor(
    private readonly translationService: ApplicationTranslationService,
    private readonly introspectionService: TemplateIntrospectionService,
    private readonly aiTranslateService: AiTranslateService,
  ) {}

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get(':namespace')
  async getTranslations(
    @Param('namespace') namespace: string,
    @Query('locale') locale: Locale = 'is',
  ) {
    return this.translationService.getTranslationsForNamespace(
      namespace,
      locale,
    )
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get(':namespace/all')
  async getAllTranslations(@Param('namespace') namespace: string) {
    return this.translationService.getTranslationsByNamespace(namespace)
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get(':namespace/status')
  async getTranslationStatus(@Param('namespace') namespace: string) {
    return this.translationService.getTranslationStatus(namespace)
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get()
  async getAllNamespacesWithStatus() {
    return this.translationService.getAllNamespacesWithStatus()
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Put()
  async updateTranslation(
    @Body() body: UpdateTranslationDto,
    @CurrentUser() user: User,
  ) {
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

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Post('bulk')
  async bulkUpdateTranslations(
    @Body() body: BulkUpdateTranslationsDto,
    @CurrentUser() user: User,
  ) {
    return this.translationService.bulkUpsertTranslations(
      body.translations,
      user.nationalId,
    )
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Post(':id/review')
  async reviewTranslation(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.translationService.markAsReviewed(id, user.nationalId)
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Post('ai-translate')
  async aiTranslate(@Body() body: AiTranslateDto) {
    const sourceTranslations =
      await this.translationService.getTranslationsForNamespace(
        body.namespace,
        body.sourceLocale as Locale,
      )

    const sourceStrings: Record<string, string> = {}
    for (const key of body.messageKeys) {
      if (sourceTranslations[key]) {
        sourceStrings[key] = sourceTranslations[key]
      }
    }

    return this.aiTranslateService.translateStrings(
      sourceStrings,
      body.sourceLocale,
      body.targetLocale,
    )
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get('templates/list')
  async listTemplates() {
    return this.introspectionService.listTemplates()
  }

  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  @Get('templates/:typeId/introspect')
  async introspectTemplate(@Param('typeId') typeId: string) {
    return this.introspectionService.introspectTemplate(
      typeId as ApplicationTypes,
    )
  }
}
