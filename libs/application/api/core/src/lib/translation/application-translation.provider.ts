import { Injectable } from '@nestjs/common'
import { getApplicationTranslationNamespaceSet } from '@island.is/application/utils'
import { type ApplicationTranslationProvider } from '@island.is/islandis-translations'
import { Locale } from '@island.is/shared/types'
import { ApplicationTranslationService } from './application-translation.service'

const applicationNamespaces = getApplicationTranslationNamespaceSet()

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
    return this.translationService.getTranslationsForNamespace(
      namespace,
      locale,
    )
  }
}
