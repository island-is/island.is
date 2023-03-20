import { Module } from '@nestjs/common'

import { RegulationsService } from './regulations.service'

@Module({
  providers: [RegulationsService],
  exports: [RegulationsService],
})
export class RegulationsClientModule {}
