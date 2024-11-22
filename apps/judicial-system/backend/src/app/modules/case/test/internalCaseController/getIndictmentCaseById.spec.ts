import { indictmentCases } from '@island.is/judicial-system/types'

import { DefendantNationalIdExistsGuard } from '../../../defendant'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Get indictment case by id', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.getDefendantIndictmentCaseById,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(3)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[2]()).toBeInstanceOf(DefendantNationalIdExistsGuard)
  })
})
