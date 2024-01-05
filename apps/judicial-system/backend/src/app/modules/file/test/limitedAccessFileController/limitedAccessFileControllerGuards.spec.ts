import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseCompletedGuard, LimitedAccessCaseExistsGuard } from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', LimitedAccessFileController)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(CaseCompletedGuard)
  })
})
