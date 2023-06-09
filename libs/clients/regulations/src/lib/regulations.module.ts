import { Module } from '@nestjs/common'

import { RegulationsService } from './regulations.service'
import { RegulationsPublishService } from './regulationsPublish.service'

@Module({
  providers: [RegulationsService, RegulationsPublishService],
  exports: [RegulationsService, RegulationsPublishService],
})
export class RegulationsClientModule {}
