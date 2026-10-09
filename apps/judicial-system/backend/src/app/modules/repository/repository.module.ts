import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ConfigModule } from '@island.is/nest/config'

import { AppealCaseRepositoryService } from './services/appealCaseRepository.service'
import { AppealDecisionRepositoryService } from './services/appealDecisionRepository.service'
import { AppealEventLogRepositoryService } from './services/appealEventLogRepository.service'
import { AppealSummonsRepositoryService } from './services/appealSummonsRepository.service'
import { CaseArchiveRepositoryService } from './services/caseArchiveRepository.service'
import { CaseDefendantPoliceCaseNumberRepositoryService } from './services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseFileRepositoryService } from './services/caseFileRepository.service'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CaseStringRepositoryService } from './services/caseStringRepository.service'
import { CivilClaimantRepositoryService } from './services/civilClaimantRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'
import { CourtSessionStringRepositoryService } from './services/courtSessionStringRepository.service'
import { DateLogRepositoryService } from './services/dateLogRepository.service'
import { DefendantEventLogRepositoryService } from './services/defendantEventLogRepository.service'
import { DefendantRepositoryService } from './services/defendantRepository.service'
import { EventLogRepositoryService } from './services/eventLogRepository.service'
import { IndictmentCountRepositoryService } from './services/indictmentCountRepository.service'
import { IndictmentSubtypeRepositoryService } from './services/indictmentSubtypeRepository.service'
import { InstitutionContactRepositoryService } from './services/institutionContactRepository.service'
import { InstitutionRepositoryService } from './services/institutionRepository.service'
import { LawyerRegistryRepositoryService } from './services/lawyerRegistryRepository.service'
import { MessageSuspensionRepositoryService } from './services/messageSuspensionRepository.service'
import { NotificationRepositoryService } from './services/notificationRepository.service'
import { OffenseRepositoryService } from './services/offenseRepository.service'
import { PoliceDigitalCaseFileRepositoryService } from './services/policeDigitalCaseFileRepository.service'
import { RobotLogRepositoryService } from './services/robotLogRepository.service'
import { SubpoenaRepositoryService } from './services/subpoenaRepository.service'
import { UserRepositoryService } from './services/userRepository.service'
import { VerdictRepositoryService } from './services/verdictRepository.service'
import { VictimRepositoryService } from './services/victimRepository.service'
import { repositoryModuleConfig } from './repository.config'
import { repositoryModels } from './repositoryModels'

@Module({
  imports: [
    SequelizeModule.forFeature(repositoryModels),
    ConfigModule.forFeature(repositoryModuleConfig),
  ],
  providers: [
    AppealCaseRepositoryService,
    AppealDecisionRepositoryService,
    AppealEventLogRepositoryService,
    AppealSummonsRepositoryService,
    CaseArchiveRepositoryService,
    CaseDefendantPoliceCaseNumberRepositoryService,
    CaseFileRepositoryService,
    CaseRepositoryService,
    CaseStringRepositoryService,
    CivilClaimantRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionStringRepositoryService,
    CourtDocumentRepositoryService,
    DateLogRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    EventLogRepositoryService,
    IndictmentCountRepositoryService,
    IndictmentSubtypeRepositoryService,
    InstitutionContactRepositoryService,
    InstitutionRepositoryService,
    LawyerRegistryRepositoryService,
    MessageSuspensionRepositoryService,
    NotificationRepositoryService,
    OffenseRepositoryService,
    PoliceDigitalCaseFileRepositoryService,
    RobotLogRepositoryService,
    SubpoenaRepositoryService,
    UserRepositoryService,
    VerdictRepositoryService,
    VictimRepositoryService,
  ],
  exports: [
    AppealCaseRepositoryService,
    AppealDecisionRepositoryService,
    AppealEventLogRepositoryService,
    AppealSummonsRepositoryService,
    CaseArchiveRepositoryService,
    CaseDefendantPoliceCaseNumberRepositoryService,
    CaseFileRepositoryService,
    CaseRepositoryService,
    CaseStringRepositoryService,
    CivilClaimantRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionStringRepositoryService,
    CourtDocumentRepositoryService,
    DateLogRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    EventLogRepositoryService,
    IndictmentCountRepositoryService,
    IndictmentSubtypeRepositoryService,
    InstitutionContactRepositoryService,
    InstitutionRepositoryService,
    LawyerRegistryRepositoryService,
    MessageSuspensionRepositoryService,
    NotificationRepositoryService,
    OffenseRepositoryService,
    PoliceDigitalCaseFileRepositoryService,
    RobotLogRepositoryService,
    SubpoenaRepositoryService,
    UserRepositoryService,
    VerdictRepositoryService,
    VictimRepositoryService,
  ],
})
export class RepositoryModule {}
