import { CanActivate } from '@nestjs/common'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import {
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseReadGuard,
} from '../../case'
import { PoliceController } from '../police.controller'

describe('PoliceController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', PoliceController)
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

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have CaseReadGuard as guard 4', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
    })
  })

  describe('CaseNotCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[4]()
    })

    it('should have CaseNotCompletedGuard as guard 5', () => {
      expect(guard).toBeInstanceOf(CaseNotCompletedGuard)
    })
  })
})
