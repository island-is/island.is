import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Create guards', () => {
  let guards: Array<new () => CanActivate>

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CivilClaimantController.prototype.create,
    )
  })

  it('should have the correct guards in the correct order', () => {
    const expectedGuards = [CaseExistsGuard, CaseWriteGuard]

    expect(guards).toHaveLength(expectedGuards.length)

    expectedGuards.forEach((expectedGuard, index) => {
      const guardInstance = new guards[index]()
      expect(guardInstance).toBeInstanceOf(expectedGuard)
    })
  })
})
