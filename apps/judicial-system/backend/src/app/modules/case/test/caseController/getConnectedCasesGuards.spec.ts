import { JwtAuthUserGuard } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'

describe('CaseController - Get connected cases by case id guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.getConnectedCases,
    )
  })

  it('should have the right guard configuration', () => {
    expect(new guards[0]()).toBeInstanceOf(JwtAuthUserGuard)
    expect(new guards[1]()).toBeInstanceOf(CaseExistsGuard)
  })
})
