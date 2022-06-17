import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard } from '../../../case'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Get all case files guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalFileController.prototype.getAllCaseFiles,
    )
  })

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })
})
