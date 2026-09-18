import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ApplicationTranslationService } from '@island.is/application/api/core'
import type { ApplicationNamespaceTranslations } from '@island.is/islandis-translations'
import type { Locale } from '@island.is/shared/types'

/**
 * Unauthenticated read of application template strings for island.is API (`getTranslations` via HTTP provider).
 * Same data is already exposed through the authenticated user flow; this endpoint is server-to-server only in practice.
 */
@ApiTags('translations')
@Controller('public/translations')
export class PublicTranslationController {
  constructor(
    private readonly translationService: ApplicationTranslationService,
  ) {}

  @Get(':namespace/locales')
  async getTranslationsForAllLocales(
    @Param('namespace') namespace: string,
  ): Promise<ApplicationNamespaceTranslations> {
    return this.translationService.getTranslationsForAllLocales(namespace)
  }

  @Get(':namespace')
  async getTranslations(
    @Param('namespace') namespace: string,
    @Query('locale') locale: Locale = 'is',
  ): Promise<Record<string, string>> {
    return this.translationService.getTranslationsForNamespace(
      namespace,
      locale,
    )
  }
}
