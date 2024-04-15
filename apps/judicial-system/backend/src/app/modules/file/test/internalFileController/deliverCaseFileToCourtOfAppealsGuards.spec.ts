import { CaseExistsGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalCaseController - Deliver case file to court of appeals guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalFileController.prototype.deliverCaseFileToCourtOfAppeals,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(2)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(new guards[1]()).toBeInstanceOf(CaseFileExistsGuard)
  })
})
