import { CanActivate } from '@nestjs/common'

import { RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import {
  CaseExistsGuard,
  CaseReceivedGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'

describe('FileController - Upload case file to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.uploadCaseFileToCourt,
    )
  })

  it('should have six guards', () => {
    expect(guards).toHaveLength(6)
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

  describe('CaseTypeGuerd', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[2]
    })

    it('should have CaseTypeGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseWriteGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })

  describe('CaseReceivedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseReceivedGuard as quard 5', () => {
      expect(guard).toBeInstanceOf(CaseReceivedGuard)
    })
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[5]()
    })

    it('should have CaseFileExistsGuard as quard 6', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })
})
