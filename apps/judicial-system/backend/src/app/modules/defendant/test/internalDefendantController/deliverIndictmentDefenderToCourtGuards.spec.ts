import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

describe('InternalDefendantController - Deliver indictment defender to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalDefendantController.prototype.deliverIndictmentDefenderToCourt,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(guards[0]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[0]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[1]()).toBeInstanceOf(DefendantExistsGuard)
  })
})
