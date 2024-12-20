import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantController } from '../../civilClaimant.controller'
import { CivilClaimantExistsGuard } from '../../guards/civilClaimantExists.guard'

describe('CivilClaimantController - Delete guards', () => {
  let guards: Array<new () => CanActivate>
  const expectedGuards = [
    CaseExistsGuard,
    CaseWriteGuard,
    CivilClaimantExistsGuard,
  ]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CivilClaimantController.prototype.delete,
    )
  })

  it('should have the correct guards in the correct order', () => {
    expect(guards).toHaveLength(expectedGuards.length)

    expectedGuards.forEach((expectedGuard, index) => {
      const guardInstance = new guards[index]()
      expect(guardInstance).toBeInstanceOf(expectedGuard)
    })
  })
})
