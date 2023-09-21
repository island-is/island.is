import { ChildPensionReason } from './lib/constants'

export interface ChildPensionRow {
  nationalIdOrBirthDate: string
  name: string
  editable?: boolean
  childDoesNotHaveNationalId: boolean
  reason?: ChildPensionReason[]
  parentIsDead?: ParentIsDead[]
  parentsPenitentiary?: ParentsPenitentiary
}

export interface ParentIsDead {
  nationalIdOrBirthDate: string
  name: string
  parentDoesNotHaveNationalId: boolean
}

export interface ParentsPenitentiary {
  nationalId: string
  name: string
}
