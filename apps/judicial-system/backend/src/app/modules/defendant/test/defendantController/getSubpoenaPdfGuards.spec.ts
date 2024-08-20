import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../../case'
import { DefendantController } from '../../defendant.controller'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'

describe('CaseController - Get custody notice pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      DefendantController.prototype.getSubpoenaPdf,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[2]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[3]()).toBeInstanceOf(DefendantExistsGuard)
  })
})
