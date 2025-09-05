import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { CourtSessionController } from './courtSession.controller'
import { CourtSessionService } from './courtSession.service'

@Module({
  imports: [forwardRef(() => CaseModule), RepositoryModule],
  controllers: [CourtSessionController],
  providers: [CourtSessionService],
})
export class CourtSessionModule {}
