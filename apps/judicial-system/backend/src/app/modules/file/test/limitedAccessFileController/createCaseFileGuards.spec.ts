import { CanActivate } from '@nestjs/common'

import { LimitedAccessFileController } from '../../limitedAccessFile.controller'
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'

describe('LimitedAccessFileController - Create case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.createCaseFile,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('LimitedAccessWriteCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have LimitedAccessWriteCaseFileGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(LimitedAccessWriteCaseFileGuard)
    })
  })
})
