import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { RestrictedCaseExistsGuard } from '../../guards/restrictedCaseExists.guard'
import { RestrictedCaseController } from '../../restrictedCase.controller'

describe('RestrictedCaseController - Find defender by national id guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      RestrictedCaseController.prototype.findDefenderByNationalId,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
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

  describe('RestrictedCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have RestrictedCaseExistsGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(RestrictedCaseExistsGuard)
    })
  })
})
