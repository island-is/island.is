import { CanActivate } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'

import {
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { FileController } from '../../file.controller'

describe('FileController - Delete case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.deleteCaseFile,
    )
  })

  it('should have file guards', () => {
    expect(guards).toHaveLength(5)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseExistsGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
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

  describe('CaseNotCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseNotCompletedGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseNotCompletedGuard)
    })
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseFileExistsGuard as quard 5', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })
})
