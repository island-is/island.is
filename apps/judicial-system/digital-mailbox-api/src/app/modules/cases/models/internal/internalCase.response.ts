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
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  state?: CaseState
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
  verdictViewDate?: Date
  verdictAppealDecision?: VerdictAppealDecision
  verdictAppealDate?: Date
  informationForDefendant?: InformationForDefendant[]
  serviceRequirement?: ServiceRequirement
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
