import { DefenderChoice } from '@island.is/judicial-system/types'

export class InternalDefendantResponse {
  id!: string
  defenderChoice?: DefenderChoice
  defenderName?: string
  requestedDefenderChoice?: DefenderChoice
  requestedDefenderNationalId?: string
  requestedDefenderName?: string
}
