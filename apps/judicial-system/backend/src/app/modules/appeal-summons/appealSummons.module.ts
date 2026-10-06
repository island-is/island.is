import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { AppealSummonsController } from './appealSummons.controller'
import { AppealSummonsService } from './appealSummons.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
  ],
  controllers: [AppealSummonsController],
  providers: [AppealSummonsService],
  exports: [AppealSummonsService],
})
export class AppealSummonsModule {}
