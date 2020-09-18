import { Module } from '@nestjs/common'
import { TranslationsService } from './translations.service'
import { TranslationsResolver } from './translations.resolver'
import { CmsModule } from '@island.is/api/domains/cms'

@Module({
  imports: [CmsModule],
  providers: [TranslationsResolver, TranslationsService],
})
export class TranslationsModule {}
