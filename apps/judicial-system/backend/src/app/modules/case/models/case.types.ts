import { CaseState } from '@island.is/judicial-system/types'

export interface MinimalCase {
  id: string
  state: CaseState
  isArchived?: boolean
}
