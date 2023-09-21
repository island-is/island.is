import { ChildPensionReason } from './lib/constants'

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
  childDoesNotHaveNationalId: boolean
  reason?: ChildPensionReason[]
  parentIsDead?: ParentIsDead[]
}

export interface ParentIsDead {
  nationalIdOrBirthDate: string
  name: string
  parentDoesNotHaveNationalId: boolean
}
