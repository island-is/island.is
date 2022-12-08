import { CanActivate } from '@nestjs/common'

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

  it('should have four guards', () => {
    expect(guards).toHaveLength(4)
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

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseReadGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
    })
  })

  describe('ViewCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have ViewCaseFileGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(ViewCaseFileGuard)
    })
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseFileExistsGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })
})
