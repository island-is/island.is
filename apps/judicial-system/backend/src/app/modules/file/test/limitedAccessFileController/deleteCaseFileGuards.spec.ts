import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Delete case file guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.deleteCaseFile,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(guards[0]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[0]).toEqual({
      allowedCaseTypes: [...restrictionCases, ...investigationCases],
    })
    expect(new guards[1]()).toBeInstanceOf(CaseWriteGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseFileExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(LimitedAccessWriteCaseFileGuard)
  })
})
