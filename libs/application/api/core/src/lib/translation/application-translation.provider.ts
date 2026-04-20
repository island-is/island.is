import { Injectable } from '@nestjs/common'
import { ApplicationConfigurations } from '@island.is/application/types'
import type { ApplicationTranslationProvider } from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'
import { ApplicationTranslationService } from './application-translation.service'

const applicationNamespaces = new Set<string>()

for (const config of Object.values(ApplicationConfigurations)) {
  const namespaces = Array.isArray(config.translation)
    ? config.translation
    : [config.translation]
  for (const ns of namespaces) {
    applicationNamespaces.add(ns)
  }
}

@Injectable()
export class ApplicationTranslationProviderImpl
  implements ApplicationTranslationProvider
{
  constructor(
    private readonly translationService: ApplicationTranslationService,
  ) {}

  isApplicationNamespace(namespace: string): boolean {
    return applicationNamespaces.has(namespace)
  }

  async getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>> {
    return this.translationService.getTranslationsForNamespace(namespace, locale)
  }
}
