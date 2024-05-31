import { DefenderChoice } from '@island.is/judicial-system/types'

export interface UpdatedDefendantResponse {
  id: string
  defenderChoice?: DefenderChoice
  defenderName?: string
}
