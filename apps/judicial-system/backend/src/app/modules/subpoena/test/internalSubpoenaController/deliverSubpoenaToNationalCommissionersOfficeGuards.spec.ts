import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { SubpoenaExistsGuard } from '../../guards/subpoenaExists.guard'
import { InternalSubpoenaController } from '../../internalSubpoena.controller'

describe('InternalSubpoenaController - Deliver subpoena to national commissioner office guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalSubpoenaController.prototype.deliverSubpoenaToNationalCommissionersOffice,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(new guards[0]()).toBeInstanceOf(CaseExistsGuard)
    expect(guards[1]).toBeInstanceOf(CaseTypeGuard)
    expect(guards[1]).toEqual({
      allowedCaseTypes: indictmentCases,
    })
    expect(new guards[2]()).toBeInstanceOf(DefendantExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(SubpoenaExistsGuard)
  })
})
