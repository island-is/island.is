import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module, CaseModule, RepositoryModule } from '..'
import { AppealSummonsController } from './appealSummons.controller'
import { AppealSummonsService } from './appealSummons.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => AwsS3Module),
  ],
  controllers: [AppealSummonsController],
  providers: [AppealSummonsService],
  exports: [AppealSummonsService],
})
export class AppealSummonsModule {}
