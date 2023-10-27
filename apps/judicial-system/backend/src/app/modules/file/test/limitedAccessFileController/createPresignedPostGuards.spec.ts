import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create presigned post guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.createPresignedPost,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(guards[0]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[0]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
    expect(new guards[1]()).toBeInstanceOf(CaseWriteGuard)
  })
})
