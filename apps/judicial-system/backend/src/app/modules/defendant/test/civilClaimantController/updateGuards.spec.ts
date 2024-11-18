import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Update guards', () => {
  let guards: Array<new () => CanActivate>
  const expectedGuards = [CaseExistsGuard, CaseWriteGuard]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CivilClaimantController.prototype.update,
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
