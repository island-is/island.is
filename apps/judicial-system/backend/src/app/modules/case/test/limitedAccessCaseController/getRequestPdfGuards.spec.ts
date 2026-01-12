import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { RequestSharedWithDefenderGuard } from '../../guards/requestSharedWithDefender.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get request pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.getRequestPdf,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[3]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[3]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
    expect(new guards[4]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[5]()).toBeInstanceOf(RequestSharedWithDefenderGuard)
  })
})
