import { CanActivate } from '@nestjs/common'

import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { UserExistsGuard } from '../../../user'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Deliver request to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.deliverRequestToCourt,
    )
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
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
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })

  describe('UserExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have UserExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(UserExistsGuard)
    })
  })
})
