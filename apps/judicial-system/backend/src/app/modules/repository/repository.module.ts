import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ConfigModule } from '@island.is/nest/config'

import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CourtDocument } from './models/courtDocument.model'
import { CourtSession } from './models/courtSession.model'
import { Defendant } from './models/defendant.model'
import { DefendantEventLog } from './models/defendantEventLog.model'
import { Subpoena } from './models/subpoena.model'
import { CaseArchiveRepositoryService } from './services/caseArchiveRepository.service'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'
import { DefendantEventLogRepositoryService } from './services/defendantEventLogRepository.service'
import { DefendantRepositoryService } from './services/defendantRepository.service'
import { SubpoenaRepositoryService } from './services/subpoenaRepository.service'
import { repositoryModuleConfig } from './repository.config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Case,
      CaseArchive,
      CourtSession,
      CourtDocument,
      Defendant,
      DefendantEventLog,
      Subpoena,
    ]),
    ConfigModule.forFeature(repositoryModuleConfig),
  ],
  providers: [
    CaseArchiveRepositoryService,
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    SubpoenaRepositoryService,
  ],
  exports: [
    CaseArchiveRepositoryService,
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    SubpoenaRepositoryService,
  ],
})
export class RepositoryModule {}
