import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { SubpoenaController } from '../../subpoena.controller'

describe('SubpoenaController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', SubpoenaController)
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
    expect(new guards[5]()).toBeInstanceOf(DefendantExistsGuard)
  })
})
