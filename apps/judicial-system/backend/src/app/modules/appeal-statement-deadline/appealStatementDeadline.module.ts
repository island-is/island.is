import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { AppealStatementDeadlineController } from './appealStatementDeadline.controller'
import { AppealStatementDeadlineService } from './appealStatementDeadline.service'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => RepositoryModule)],
  controllers: [AppealStatementDeadlineController],
  providers: [AppealStatementDeadlineService],
  exports: [AppealStatementDeadlineService],
})
export class AppealStatementDeadlineModule {}
