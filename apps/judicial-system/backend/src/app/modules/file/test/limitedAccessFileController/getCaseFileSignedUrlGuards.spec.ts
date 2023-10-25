import { CaseReadGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessViewCaseFileGuard } from '../../guards/limitedAccessViewCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      LimitedAccessFileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(3)
    expect(new guards[0]()).toBeInstanceOf(CaseReadGuard)
    expect(new guards[1]()).toBeInstanceOf(CaseFileExistsGuard)
    expect(new guards[2]()).toBeInstanceOf(LimitedAccessViewCaseFileGuard)
  })
})
