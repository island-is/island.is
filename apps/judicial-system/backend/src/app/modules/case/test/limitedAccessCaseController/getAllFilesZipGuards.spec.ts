import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseDefenderGuard } from '../../guards/caseDefender.guard'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get all files zip guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.getAllFilesZip,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[3]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[3]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
    expect(new guards[4]()).toBeInstanceOf(CaseCompletedGuard)
    expect(new guards[5]()).toBeInstanceOf(CaseDefenderGuard)
  })
})
