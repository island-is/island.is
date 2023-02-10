import { CanActivate } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'

import { CaseExistsGuard, CaseReadGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { ViewCaseFileGuard } from '../../guards/viewCaseFile.guard'
import { FileController } from '../../file.controller'

describe('FileController - Get case file signed url guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should have five guards', () => {
    expect(guards).toHaveLength(5)
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

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseExistsGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseReadGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
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
