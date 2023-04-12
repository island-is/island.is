import { CanActivate } from '@nestjs/common'

import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Delete case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.deleteCaseFile,
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

  describe('LimitedAccessWriteCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have LimitedAccessWriteCaseFileGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(LimitedAccessWriteCaseFileGuard)
    })
  })
})
