import { Module } from '@nestjs/common'

import { CmsModule } from '@island.is/cms'

import { CmsTranslationsResolver } from './cms-translations.resolver'
import { CmsTranslationsService } from './cms-translations.service'
import { IntlService } from './intl.service'

@Module({
  controllers: [],
  imports: [CmsModule],
  providers: [CmsTranslationsResolver, CmsTranslationsService, IntlService],
  exports: [CmsTranslationsService, IntlService],
})
export class CmsTranslationsModule {}
