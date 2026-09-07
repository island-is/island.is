import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, EventLogModule, FileModule, RepositoryModule } from '..'
import { CourtDocumentController } from './courtDocument.controller'
import { CourtDocumentService } from './courtDocument.service'
import { CourtSessionController } from './courtSession.controller'
import { CourtSessionService } from './courtSession.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => FileModule),
    forwardRef(() => EventLogModule),
  ],
  controllers: [CourtSessionController, CourtDocumentController],
  providers: [CourtSessionService, CourtDocumentService],
  exports: [CourtSessionService, CourtDocumentService],
})
export class CourtSessionModule {}
