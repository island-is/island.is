import { CanActivate } from '@nestjs/common'

import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessViewCaseFileGuard } from '../../guards/limitedAccessViewCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseFileExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })

  describe('LimitedAccessViewCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have LimitedAccessViewCaseFileGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(LimitedAccessViewCaseFileGuard)
    })
  })
})
