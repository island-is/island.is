import { ChildPensionReason } from './lib/constants'

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
  childDoesNotHaveNationalId: boolean
  reason?: ChildPensionReason[]
}
