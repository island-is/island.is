import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ConfigModule } from '@island.is/nest/config'

import { AwsS3Module } from '../aws-s3/awsS3.module'
import { AppealCase } from './models/appealCase.model'
import { AppealDecision } from './models/appealDecision.model'
import { AppealEventLog } from './models/appealEventLog.model'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseDefendantPoliceCaseNumber } from './models/caseDefendantPoliceCaseNumber.model'
import { CaseFile } from './models/caseFile.model'
import { CaseString } from './models/caseString.model'
import { CivilClaimant } from './models/civilClaimant.model'
import { CourtDocument } from './models/courtDocument.model'
import { CourtSession } from './models/courtSession.model'
import { CourtSessionString } from './models/courtSessionString.model'
import { DateLog } from './models/dateLog.model'
import { Defendant } from './models/defendant.model'
import { DefendantEventLog } from './models/defendantEventLog.model'
import { EventLog } from './models/eventLog.model'
import { IndictmentCount } from './models/indictmentCount.model'
import { IndictmentSubtype } from './models/indictmentSubtype.model'
import { Institution } from './models/institution.model'
import { InstitutionContact } from './models/institutionContact.model'
import { LawyerRegistry } from './models/lawyerRegistry.model'
import { MessageSuspension } from './models/messageSuspension.model'
import { Notification } from './models/notification.model'
import { Offense } from './models/offense.model'
import { PoliceDigitalCaseFile } from './models/policeDigitalCaseFile.model'
import { RobotLog } from './models/robotLog.model'
import { Subpoena } from './models/subpoena.model'
import { User } from './models/user.model'
import { Verdict } from './models/verdict.model'
import { Victim } from './models/victim.model'
import { AppealCaseRepositoryService } from './services/appealCaseRepository.service'
import { AppealDecisionRepositoryService } from './services/appealDecisionRepository.service'
import { AppealEventLogRepositoryService } from './services/appealEventLogRepository.service'
import { CaseArchiveRepositoryService } from './services/caseArchiveRepository.service'
import { CaseDefendantPoliceCaseNumberRepositoryService } from './services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CaseStringRepositoryService } from './services/caseStringRepository.service'
import { CourtDocumentRepositoryService } from './services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'
import { CourtSessionStringRepositoryService } from './services/courtSessionStringRepository.service'
import { DefendantEventLogRepositoryService } from './services/defendantEventLogRepository.service'
import { DefendantRepositoryService } from './services/defendantRepository.service'
import { EventLogRepositoryService } from './services/eventLogRepository.service'
import { IndictmentSubtypeRepositoryService } from './services/indictmentSubtypeRepository.service'
import { InstitutionContactRepositoryService } from './services/institutionContactRepository.service'
import { InstitutionRepositoryService } from './services/institutionRepository.service'
import { LawyerRegistryRepositoryService } from './services/lawyerRegistryRepository.service'
import { MessageSuspensionRepositoryService } from './services/messageSuspensionRepository.service'
import { NotificationRepositoryService } from './services/notificationRepository.service'
import { PoliceDigitalCaseFileRepositoryService } from './services/policeDigitalCaseFileRepository.service'
import { RobotLogRepositoryService } from './services/robotLogRepository.service'
import { SubpoenaRepositoryService } from './services/subpoenaRepository.service'
import { UserRepositoryService } from './services/userRepository.service'
import { VerdictRepositoryService } from './services/verdictRepository.service'
import { VictimRepositoryService } from './services/victimRepository.service'
import { repositoryModuleConfig } from './repository.config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      AppealCase,
      AppealDecision,
      AppealEventLog,
      Case,
      CaseArchive,
      CaseFile,
      CaseDefendantPoliceCaseNumber,
      CaseString,
      CivilClaimant,
      CourtDocument,
      CourtSession,
      CourtSessionString,
      DateLog,
      Defendant,
      DefendantEventLog,
      EventLog,
      IndictmentCount,
      IndictmentSubtype,
      Institution,
      InstitutionContact,
      LawyerRegistry,
      MessageSuspension,
      Notification,
      Offense,
      PoliceDigitalCaseFile,
      RobotLog,
      Subpoena,
      User,
      Verdict,
      Victim,
    ]),
    ConfigModule.forFeature(repositoryModuleConfig),
    AwsS3Module,
  ],
  providers: [
    AppealCaseRepositoryService,
    AppealDecisionRepositoryService,
    AppealEventLogRepositoryService,
    CaseArchiveRepositoryService,
    CaseDefendantPoliceCaseNumberRepositoryService,
    CaseRepositoryService,
    CaseStringRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionStringRepositoryService,
    CourtDocumentRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    EventLogRepositoryService,
    IndictmentSubtypeRepositoryService,
    InstitutionContactRepositoryService,
    InstitutionRepositoryService,
    LawyerRegistryRepositoryService,
    MessageSuspensionRepositoryService,
    NotificationRepositoryService,
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
    CaseArchiveRepositoryService,
    CaseDefendantPoliceCaseNumberRepositoryService,
    CaseRepositoryService,
    CaseStringRepositoryService,
    CourtSessionRepositoryService,
    CourtSessionStringRepositoryService,
    CourtDocumentRepositoryService,
    DefendantRepositoryService,
    DefendantEventLogRepositoryService,
    EventLogRepositoryService,
    IndictmentSubtypeRepositoryService,
    InstitutionContactRepositoryService,
    InstitutionRepositoryService,
    LawyerRegistryRepositoryService,
    MessageSuspensionRepositoryService,
    NotificationRepositoryService,
    PoliceDigitalCaseFileRepositoryService,
    RobotLogRepositoryService,
    SubpoenaRepositoryService,
    UserRepositoryService,
    VerdictRepositoryService,
    VictimRepositoryService,
  ],
})
export class RepositoryModule {}
