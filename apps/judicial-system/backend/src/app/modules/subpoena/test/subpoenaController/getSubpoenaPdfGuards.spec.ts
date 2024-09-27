import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { SubpoenaExistsOptionalGuard } from '../../guards/subpoenaExists.guard'
import { SubpoenaController } from '../../subpoena.controller'

describe('SubpoenaController - Get custody notice pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      SubpoenaController.prototype.getSubpoenaPdf,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(5)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[2]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[3]()).toBeInstanceOf(DefendantExistsGuard)
    expect(new guards[4]()).toBeInstanceOf(SubpoenaExistsOptionalGuard)
  })
})
