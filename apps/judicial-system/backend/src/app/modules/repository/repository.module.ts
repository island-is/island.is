import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ConfigModule } from '@island.is/nest/config'

import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseFile } from './models/caseFile.model'
import { CaseString } from './models/caseString.model'
import { CourtDocument } from './models/courtDocument.model'
import { CourtSession } from './models/courtSession.model'
import { DateLog } from './models/dateLog.model'
import { Defendant } from './models/defendant.model'
import { DefendantEventLog } from './models/defendantEventLog.model'
import { EventLog } from './models/eventLog.model'
import { IndictmentCount } from './models/indictmentCount.model'
import { Subpoena } from './models/subpoena.model'
import { Verdict } from './models/verdict.model'
import { Victim } from './models/victim.model'
import { CaseArchiveRepositoryService } from './services/caseArchiveRepository.service'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'
import { DefendantEventLogRepositoryService } from './services/defendantEventLogRepository.service'
import { DefendantRepositoryService } from './services/defendantRepository.service'
import { SubpoenaRepositoryService } from './services/subpoenaRepository.service'
import { VerdictRepositoryService } from './services/verdictRepository.service'
import { repositoryModuleConfig } from './repository.config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Case,
      CaseArchive,
      CaseFile,
      CaseString,
      CourtDocument,
      CourtSession,
      DateLog,
      Defendant,
      DefendantEventLog,
      EventLog,
      IndictmentCount,
      Subpoena,
      Verdict,
      Victim,
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
    VerdictRepositoryService,
  ],
  exports: [
    CaseArchiveRepositoryService,
    CaseRepositoryService,
    CourtSessionRepositoryService,
    CourtDocumentRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    SubpoenaRepositoryService,
    VerdictRepositoryService,
  ],
})
export class RepositoryModule {}
