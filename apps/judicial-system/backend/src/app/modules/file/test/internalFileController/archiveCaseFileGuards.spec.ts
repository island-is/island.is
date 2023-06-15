import { CanActivate } from '@nestjs/common'

import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseHasExistedGuard, CaseTypeGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Archive case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalFileController.prototype.archiveCaseFile,
    )
  })

  it('should have thee guards', () => {
    expect(guards).toHaveLength(3)
  })

  describe('CaseHasExistedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseHasExistedGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseHasExistedGuard)
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
        allowedCaseTypes: indictmentCases,
      })
    })
  })

  describe('CaseFileExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseFileExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(CaseFileExistsGuard)
    })
  })
})
