import { CanActivate } from '@nestjs/common'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTransitionGuard } from '../../guards/caseTransition.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Transition guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.transition,
    )
  })

  it('should have five guards', () => {
    expect(guards).toHaveLength(5)
  })

  describe('JwtAuthUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthUserGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthUserGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseExistsGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
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

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseWriteGuard as guard 4', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })
  describe('CaseTransitionGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseTransitionGuard as guard 5', () => {
      expect(guard).toBeInstanceOf(CaseTransitionGuard)
    })
  })
})
