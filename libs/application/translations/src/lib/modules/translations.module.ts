import { Module } from '@nestjs/common'

import { TranslationsService } from './translations.service'

@Module({
  controllers: [],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
