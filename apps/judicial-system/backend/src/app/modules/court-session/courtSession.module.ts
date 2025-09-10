import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { CourtDocumentController } from './courtDocument.controller'
import { CourtDocumentService } from './courtDocument.service'
import { CourtSessionController } from './courtSession.controller'
import { CourtSessionService } from './courtSession.service'

@Module({
  imports: [forwardRef(() => CaseModule), RepositoryModule],
  controllers: [CourtSessionController, CourtDocumentController],
  providers: [CourtSessionService, CourtDocumentService],
})
export class CourtSessionModule {}
