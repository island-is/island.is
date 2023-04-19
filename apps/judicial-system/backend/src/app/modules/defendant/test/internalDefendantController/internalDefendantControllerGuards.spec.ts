import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard } from '../../../case'
import { InternalDefendantController } from '../../internalDefendant.controller'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'

describe('InternalDefendantController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalDefendantController)
  })

  it('should have four guards', () => {
    expect(guards).toHaveLength(4)
  })

  describe('TokenGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have TokenGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(TokenGuard)
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

  describe('CaseTypeGuard', () => {
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

  describe('DefendantExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have DefendantExistsGuard as quard 4', () => {
      expect(guard).toBeInstanceOf(DefendantExistsGuard)
    })
  })
})
