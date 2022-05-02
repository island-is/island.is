import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { RestrictedCaseExistsGuard } from '../../guards/restrictedCaseExists.guard'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseDefenderGuard } from '../../guards/caseDefender.guard'
import { RestrictedCaseController } from '../../restrictedCase.controller'

describe('RestrictedCaseController - Get request pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      RestrictedCaseController.prototype.getRequestPdf,
    )
  })

  it('should have five guards', () => {
    expect(guards).toHaveLength(5)
  })

  describe('JwtAuthGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[0]
    })

    it('should have JwtAuthGuard as quard 1', () => {
      // TODO: Verify that true is passed to the constructor
      expect(guard).toBeInstanceOf(JwtAuthGuard)
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

  describe('RestrictedCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have RestrictedCaseExistsGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(RestrictedCaseExistsGuard)
    })
  })

  describe('CaseCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseCompletedGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseCompletedGuard)
    })
  })

  describe('CaseDefenderGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseDefenderGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(CaseDefenderGuard)
    })
  })
})
