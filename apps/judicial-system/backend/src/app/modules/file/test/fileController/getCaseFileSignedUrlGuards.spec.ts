import { RolesGuard } from '@island.is/judicial-system/auth'

import { CaseExistsGuard, CaseReadGuard } from '../../../case'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { ViewCaseFileGuard } from '../../guards/viewCaseFile.guard'

describe('FileController - Get case file signed url guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(6)
    expect(new guards[0]()).toBeInstanceOf(RolesGuard)
    expect(new guards[1]()).toBeInstanceOf(CaseExistsGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[3]()).toBeInstanceOf(MergedCaseExistsGuard)
    expect(new guards[4]()).toBeInstanceOf(CaseFileExistsGuard)
    expect(new guards[5]()).toBeInstanceOf(ViewCaseFileGuard)
  })
})
