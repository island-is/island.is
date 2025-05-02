import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { MergedCaseExistsGuard } from '../../guards/mergedCaseExists.guard'

describe('CaseController - Get indictment pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.getIndictmentPdf,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[3]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[3]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[4]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[5]()).toBeInstanceOf(MergedCaseExistsGuard)
  })
})
