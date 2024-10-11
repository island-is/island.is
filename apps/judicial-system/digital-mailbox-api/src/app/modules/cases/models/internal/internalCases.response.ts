import { CaseState } from '@island.is/judicial-system/types'

export class InternalCasesResponse {
  id!: string
  courtCaseNumber!: string
  type!: string
  state!: CaseState
}
