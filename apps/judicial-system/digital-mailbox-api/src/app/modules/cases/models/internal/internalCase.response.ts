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
} from '@island.is/judicial-system/types'

export class InternalCaseResponse {
  id!: string
  courtCaseNumber!: string
  defendants!: Defendant[]
  court!: Institution
  judge!: User
  prosecutorsOffice!: Institution
  prosecutor!: User
  dateLogs?: DateLog[]
  rulingDate?: Date
  ruling?: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  state?: CaseState
  courtSessions?: CourtSession[]
  indictmentSentToPublicProsecutorDate?: Date
}

interface CourtSession {
  ruling?: string
}

interface Defendant {
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
}
