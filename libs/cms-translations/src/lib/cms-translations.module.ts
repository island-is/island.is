import { Module } from '@nestjs/common'

import { CmsModule } from '@island.is/cms'

import { CmsTranslationsService } from './cms-translations.service'
import { CmsTranslationsResolver } from './cms-translations.resolver'
import { CmsTranslationCacheModule } from './cms-translation.cache'
import { IntlService } from './intl.service'
import { CmsTranslationConfig } from './cms-translation.config'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [],
  imports: [
    CmsModule,
    CmsTranslationCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CmsTranslationConfig],
    }),
  ],
  providers: [CmsTranslationsResolver, CmsTranslationsService, IntlService],
  exports: [CmsTranslationsService, IntlService],
})
export class CmsTranslationsModule {}
