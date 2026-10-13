import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { AppealCourtSessionController } from './appealCourtSession.controller'
import { AppealCourtSessionService } from './appealCourtSession.service'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => RepositoryModule)],
  controllers: [AppealCourtSessionController],
  providers: [AppealCourtSessionService],
  exports: [AppealCourtSessionService],
})
export class AppealCourtSessionModule {}
