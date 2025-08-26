import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Get ruling signature confirmation guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.getRulingSignatureConfirmation,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(5)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(CaseExistsGuard)
    expect(new guards[2]()).toBeInstanceOf(RolesGuard)
    expect(guards[3]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[3]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
    expect(new guards[4]()).toBeInstanceOf(CaseWriteGuard)
  })
})
