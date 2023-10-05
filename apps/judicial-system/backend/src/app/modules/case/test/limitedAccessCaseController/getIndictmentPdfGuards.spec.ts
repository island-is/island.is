import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { LimitedAccessAccordingToCaseStateGuard } from '../../guards/limitedAccessAccordingToCaseState.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get indictment pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.getIndictmentPdf,
    )
  })

  it('should have six guards', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(CaseReadGuard)
    expect(guards[4]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[4]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[5]()).toBeInstanceOf(
      LimitedAccessAccordingToCaseStateGuard,
    )
  })
})
