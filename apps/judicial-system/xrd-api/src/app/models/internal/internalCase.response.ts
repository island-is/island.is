import { DefenderChoice, Institution } from '@island.is/judicial-system/types'

export class InternalCaseResponse {
  id!: string
  courtCaseNumber!: string
  defendants!: Defendant[]
  court!: Institution
}

interface Defendant {
  nationalId?: string
  defenderName?: string
  defenderNationalId?: string
  defenderChoice?: DefenderChoice
}
