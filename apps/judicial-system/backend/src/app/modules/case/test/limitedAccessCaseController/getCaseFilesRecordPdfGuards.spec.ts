import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { LimitedAccessCaseStateGuard } from '../../guards/limitedAccessAccordingToCaseState.guard'
import { CaseDefenderGuard } from '../../guards/caseDefender.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get case files record pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.getCaseFilesRecordPdf,
    )
  })

  it('should have six guards', () => {
    expect(guards).toHaveLength(6)
  })

  describe('JwtAuthGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RolesGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseTypeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[3]
    })

    it('should have CaseTypeGuard as guard 4', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: indictmentCases,
      })
    })
  })

  describe('LimitedAccessCaseStateGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have LimitedAccessCaseStateGuard as guard 5', () => {
      expect(guard).toBeInstanceOf(LimitedAccessCaseStateGuard)
    })
  })

  describe('CaseDefenderGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[5]()
    })

    it('should have CaseDefenderGuard as guard 6', () => {
      expect(guard).toBeInstanceOf(CaseDefenderGuard)
    })
  })
})
