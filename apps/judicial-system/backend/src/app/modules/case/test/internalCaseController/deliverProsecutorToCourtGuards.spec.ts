import { CanActivate } from '@nestjs/common'

import { UserExistsGuard } from '../../../user'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Deliver prosecutor to court guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.deliverProsecutorToCourt,
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

    it('should have CaseExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('UserExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have UserExistsGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(UserExistsGuard)
    })
  })
})
