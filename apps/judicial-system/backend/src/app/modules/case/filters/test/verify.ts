import { User } from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { canUserAccessCase } from '../case.filter'

export const verifyNoAccess = (theCase: Case, user: User) => {
  let hasReadAccess: boolean
  let hasWriteAccess: boolean

  beforeEach(() => {
    hasReadAccess = canUserAccessCase(theCase, user, false)
    hasWriteAccess = canUserAccessCase(theCase, user, true)
  })

  it('should have no access', () => {
    expect(hasReadAccess).toBe(false)
    expect(hasWriteAccess).toBe(false)
  })
}

export const verifyFullAccess = (theCase: Case, user: User) => {
  let hasReadAccess: boolean
  let hasWriteAccess: boolean

  beforeEach(() => {
    hasReadAccess = canUserAccessCase(theCase, user, false)
    hasWriteAccess = canUserAccessCase(theCase, user, true)
  })

  it('should have full access', () => {
    expect(hasReadAccess).toBe(true)
    expect(hasWriteAccess).toBe(true)
  })
}

export const verifyReadAccess = (theCase: Case, user: User) => {
  let hasReadAccess: boolean
  let hasWriteAccess: boolean

  beforeEach(() => {
    hasReadAccess = canUserAccessCase(theCase, user, false)
    hasWriteAccess = canUserAccessCase(theCase, user, true)
  })

  it('should have read access', () => {
    expect(hasReadAccess).toBe(true)
    expect(hasWriteAccess).toBe(false)
  })
}
