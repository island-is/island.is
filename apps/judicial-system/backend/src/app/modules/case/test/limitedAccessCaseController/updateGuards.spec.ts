import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../../guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Update guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.update,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    expect(guards[3]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[3]).toEqual({
      allowedCaseTypes: [
        ...restrictionCases,
        ...investigationCases,
        ...indictmentCases,
      ],
    })
    expect(new guards[4]()).toBeInstanceOf(CaseWriteGuard)
    expect(new guards[5]()).toBeInstanceOf(CaseCompletedGuard)
  })
})
