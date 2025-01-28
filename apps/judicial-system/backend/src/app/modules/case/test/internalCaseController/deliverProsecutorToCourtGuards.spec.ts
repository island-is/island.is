import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Deliver prosecutor to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.deliverProsecutorToCourt,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
  })
})
