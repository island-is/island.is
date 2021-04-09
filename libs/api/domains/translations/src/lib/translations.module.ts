import { Module } from '@nestjs/common'
import { CmsModule } from '@island.is/api/domains/cms'

import { TranslationsService } from './translations.service'
import { TranslationsResolver } from './translations.resolver'
import { IntlService } from './services/intl.service'

@Module({
  controllers: [],
  imports: [CmsModule],
  providers: [TranslationsResolver, TranslationsService, IntlService],
  exports: [TranslationsService, IntlService],
})
export class TranslationsModule {}
