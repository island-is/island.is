import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { CourtSessionController } from './courtSession.controller'
import { CourtSessionService } from './courtSession.service'
import { CourtSessionDocumentController } from './courtSessionDocument.controller'
import { CourtSessionDocumentService } from './courtSessionDocument.service'

@Module({
  imports: [forwardRef(() => CaseModule), RepositoryModule],
  controllers: [CourtSessionController, CourtSessionDocumentController],
  providers: [CourtSessionService, CourtSessionDocumentService],
})
export class CourtSessionModule {}
