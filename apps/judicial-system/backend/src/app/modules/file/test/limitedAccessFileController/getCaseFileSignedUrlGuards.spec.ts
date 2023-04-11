import { CanActivate } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'

import { CaseDefenderGuard, LimitedAccessCaseExistsGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { ViewCaseFileGuard } from '../../guards/viewCaseFile.guard'
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

  it('should have five guards', () => {
    expect(guards).toHaveLength(5)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('LimitedAccessCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have LimitedAccessCaseExistsGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    })
  })

  describe('CaseDefenderGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseDefenderGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseDefenderGuard)
    })
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseFileExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })

  describe('ViewCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have ViewCaseFileGuard as quard 5', () => {
      expect(guard).toBeInstanceOf(ViewCaseFileGuard)
    })
  })
})
