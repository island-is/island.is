import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from './models/case.model'
import { CourtDocument } from './models/courtDocument.model'
import { CourtSession } from './models/courtSession.model'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'

@Module({
  imports: [SequelizeModule.forFeature([Case, CourtSession, CourtDocument])],
  providers: [
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
  ],
  exports: [
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
  ],
})
export class RepositoryModule {}
