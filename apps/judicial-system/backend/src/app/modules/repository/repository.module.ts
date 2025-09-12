import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CourtDocument } from './models/courtDocument.model'
import { CourtSession } from './models/courtSession.model'
import { CaseArchiveRepositoryService } from './services/caseArchiveRepository.service'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'

@Module({
  imports: [SequelizeModule.forFeature([Case, CaseArchive, CourtSession, CourtDocument])],
  providers: [
    CaseArchiveRepositoryService,
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
  ],
  exports: [
    CaseArchiveRepositoryService,
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
  ],
})
export class RepositoryModule {}
