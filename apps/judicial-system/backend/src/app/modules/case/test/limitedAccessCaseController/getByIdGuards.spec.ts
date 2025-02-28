import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseReadGuard } from '../../guards/caseRead.guard'
import { LimitedAccessCaseExistsGuard } from '../../guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get by id guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.getById,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(CaseReadGuard)
  })
})
