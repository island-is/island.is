import { Module } from '@nestjs/common'

import { CmsModule } from '@island.is/cms'

import { CmsTranslationsService } from './cms-translations.service'
import { CmsTranslationsResolver } from './cms-translations.resolver'
import { CmsTranslationCacheModule } from './cms-translations.cache'
import { CmsTranslationConfig } from './cms-translations.config'
import { ConfigModule } from '@nestjs/config'
import { IntlService } from './intl.service'

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
