import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseDefenderGuard } from '../../guards/caseDefender.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { LimitedAccessCaseExistsGuard } from '../../guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Transition guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessCaseController.prototype.transition,
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

  describe('LimitedAccessCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have LimitedAccessCaseExistsGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(LimitedAccessCaseExistsGuard)
    })
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have RolesGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
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
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })

  describe('CaseCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseCompletedGuard as guard 5', () => {
      expect(guard).toBeInstanceOf(CaseCompletedGuard)
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
