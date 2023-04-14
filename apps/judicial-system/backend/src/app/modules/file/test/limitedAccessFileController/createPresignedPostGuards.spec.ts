import { CanActivate } from '@nestjs/common'

import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseTypeGuard } from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create presigned post guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.createPresignedPost,
    )
  })

  it('should have no guards', () => {
    expect(guards).toHaveLength(1)
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
})
