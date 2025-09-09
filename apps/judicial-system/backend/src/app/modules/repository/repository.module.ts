import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from './models/case.model'
import { CourtSession } from './models/courtSession.model'
import { CourtSessionDocument } from './models/courtSessionDocument.model'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtSessionDocumentRepositoryService } from './services/courtSessionDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Case, CourtSession, CourtSessionDocument]),
  ],
  providers: [
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionDocumentRepositoryService,
  ],
  exports: [
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionDocumentRepositoryService,
  ],
})
export class RepositoryModule {}
