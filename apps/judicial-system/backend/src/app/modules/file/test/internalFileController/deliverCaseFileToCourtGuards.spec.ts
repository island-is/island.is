import { CanActivate } from '@nestjs/common'

import { UserExistsGuard } from '../../../user'
import { CaseExistsGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Deliver case file to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalFileController.prototype.deliverCaseFileToCourt,
    )
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
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

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseFileExistsGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })

  describe('UserExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have UserExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(UserExistsGuard)
    })
  })
})
