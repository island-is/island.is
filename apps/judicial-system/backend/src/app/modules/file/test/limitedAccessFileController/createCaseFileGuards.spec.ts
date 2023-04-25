import { CanActivate } from '@nestjs/common'

import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseTypeGuard } from '../../../case'
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.createCaseFile,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('CaseTypeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[0]
    })

    it('should have CaseTypeGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })

  describe('LimitedAccessWriteCaseFileGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have LimitedAccessWriteCaseFileGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(LimitedAccessWriteCaseFileGuard)
    })
  })
})
