import { Module } from '@nestjs/common'
import { IntellectualPropertiesClientModule } from '@island.is/clients/intellectual-properties'
import { IntellectualPropertiesService } from './intellectualProperties.service'
import { IntellectualPropertiesResolver } from './intellectualProperties.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import {
  CmsTranslationsModule,
  CmsTranslationsService,
  TranslationsDict,
} from '@island.is/cms-translations'
import { Locale } from '@island.is/shared/types'

export const TRANSLATION_DICT = 'translation-dict'

@Module({
  imports: [
    IntellectualPropertiesClientModule,
    CmsTranslationsModule,
    FeatureFlagModule,
  ],
  providers: [
    IntellectualPropertiesClientModule,
    {
      provide: TRANSLATION_DICT,
      useFactory:
        (cmsTranslationsService: CmsTranslationsService) =>
        async (locale: Locale): Promise<TranslationsDict> =>
          cmsTranslationsService.getTranslations(
            ['sp.intellectual-property'],
            locale,
          ),

      inject: [CmsTranslationsService],
    },
    IntellectualPropertiesService,
    IntellectualPropertiesResolver,
  ],
  exports: [IntellectualPropertiesService],
})
export class IntellectualPropertiesModule {}
