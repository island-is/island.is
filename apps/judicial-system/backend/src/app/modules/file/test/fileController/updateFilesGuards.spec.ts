//todo
import { indictmentCases } from '@island.is/judicial-system/types'
import { CanActivate } from '@nestjs/common'

import {
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'

describe('FileController - Upload case file to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.updateFiles,
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

  describe('CaseTypeGuerd', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[1]
    })

    it('should have CaseTypeGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: [...indictmentCases],
      })
    })
  })

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseWriteGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })

  describe('CaseReceivedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseNotCompletedGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseNotCompletedGuard)
    })
  })
})
