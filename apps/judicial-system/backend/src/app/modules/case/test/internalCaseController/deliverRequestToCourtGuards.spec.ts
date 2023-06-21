import { CanActivate } from '@nestjs/common'

import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

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

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseExistsGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseTypeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[1]
    })

    it('should have CaseTypeGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })
})
