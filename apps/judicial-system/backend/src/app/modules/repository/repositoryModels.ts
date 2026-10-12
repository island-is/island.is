import { AppealCase } from './models/appealCase.model'
import { AppealDecision } from './models/appealDecision.model'
import { AppealEventLog } from './models/appealEventLog.model'
import { AppealSummons } from './models/appealSummons.model'
import { AppealSummonsDefendant } from './models/appealSummonsDefendant.model'
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

/**
 * Every Sequelize model in this module, in one place.
 *
 * The module registers these with Sequelize, and the SQL probe the case table
 * specs use registers the same array - which is the point. A probe that built
 * its own list, however it built it, could drift from what the app runs with
 * and then assert against SQL production never emits.
 */
export const repositoryModels = [
  AppealCase,
  AppealDecision,
  AppealEventLog,
  AppealSummons,
  AppealSummonsDefendant,
  Case,
  CaseArchive,
  CaseDefendantPoliceCaseNumber,
  CaseFile,
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
]
