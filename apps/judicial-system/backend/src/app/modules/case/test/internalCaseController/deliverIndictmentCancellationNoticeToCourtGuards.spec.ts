import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Deliver indictment cancellation noticde to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype
        .deliverIndictmentCancellationNoticeToCourt,
    )
  })

  it('should have the right guard configuration', () => {
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
  })
})
