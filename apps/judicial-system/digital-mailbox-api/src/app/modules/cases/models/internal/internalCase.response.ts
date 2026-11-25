import {
  CaseIndictmentRulingDecision,
  CaseState,
  DateType,
  DefenderChoice,
  Gender,
  InformationForDefendant,
  Institution,
  ServiceRequirement,
  ServiceStatus,
  SubpoenaType,
  User,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

export class InternalCaseResponse {
  id!: string
  courtCaseNumber!: string
  // Civil-claimant mailbox reads omit defendants; defendant reads omit
  // civilClaimants. Keep both optional at the type level for that split.
  defendants?: Defendant[]
  civilClaimants?: CivilClaimant[]
  court!: Institution
  judge?: User | null
  prosecutorsOffice!: Institution
  prosecutor!: User & { institution?: Institution }
  dateLogs?: DateLog[]
  rulingDate?: Date
  ruling?: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  state?: CaseState
  courtSessions?: CourtSession[]
  indictmentSentToPublicProsecutorDate?: Date
  verdictAppealCase?: VerdictAppealCase
}

interface CourtSession {
  ruling?: string
}

interface Defendant {
  id?: string
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  defenderChoice?: DefenderChoice
  subpoenas?: Subpoena[]
  requestedDefenderChoice?: DefenderChoice
  requestedDefenderNationalId?: string
  requestedDefenderName?: string
  subpoenaType?: SubpoenaType
  verdict?: Verdict
  appealDefenderName?: string
  appealDefenderNationalId?: string
  appealDefenderEmail?: string
  appealDefenderPhoneNumber?: string
  isAppealDefenderWaived?: boolean
  isAppealDefenderConfirmed?: boolean
}

interface CivilClaimant {
  id?: string
  nationalId?: string
  name?: string
  hasAppealSpokesperson?: boolean
  appealSpokespersonIsLawyer?: boolean
  appealSpokespersonNationalId?: string
  appealSpokespersonName?: string
  appealSpokespersonEmail?: string
  appealSpokespersonPhoneNumber?: string
  isAppealSpokespersonConfirmed?: boolean
}

interface DateLog {
  id: string
  created: Date
  dateType: DateType
  date: Date
  location?: string
}

interface Subpoena {
  id: string
  created: Date
  subpoenaId: string
  serviceStatus?: ServiceStatus
  serviceRequirement?: ServiceRequirement
}

interface Verdict {
  id: string
  created: Date
  externalPoliceDocumentId: string
  serviceStatus?: ServiceStatus
  serviceRequirement?: ServiceRequirement
  serviceDate?: Date
  appealDecision?: VerdictAppealDecision
  serviceInformationForDefendant?: InformationForDefendant[]
  appealDate?: Date
  isDefaultJudgement?: boolean
  isAcquittedByPublicProsecutionOffice?: boolean
  defendantHasRequestedAppeal?: boolean
}

interface VerdictAppealCase {
  id?: string
  appealCaseNumber?: string
  appealSummonses?: AppealSummons[]
}

interface AppealSummons {
  id: string
  created: Date
  confirmedDate?: Date
  defendants?: AppealSummonsDefendant[]
  services?: AppealSummonsService[]
}

interface AppealSummonsDefendant {
  id: string
  defendantId: string
  appellantSide: string
  claims: string
}

interface AppealSummonsService {
  id: string
  created: Date
  defendantId?: string
  civilClaimantId?: string
  sentToServiceDate: Date
  externalPoliceDocumentId?: string
  serviceStatus?: VerdictServiceStatus
  serviceDate?: Date
}
