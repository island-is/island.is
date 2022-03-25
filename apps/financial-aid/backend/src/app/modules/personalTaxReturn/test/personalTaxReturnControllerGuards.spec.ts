import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { StaffGuard } from '../../../guards/staff.guard'

import { PersonalTaxReturnController } from '../personalTaxReturn.controller'

describe('FileController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', PersonalTaxReturnController)
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })

  describe('ScopeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have ScopeGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(ScopesGuard)
    })
  })
})

// describe('PersonalTaxReturnController - municipalities personal tax return', () => {
//   let guards: any[]

//   beforeEach(() => {
//     guards = Reflect.getMetadata(
//       '__guards__',
//       PersonalTaxReturnController.prototype.municipalitiesPersonalTaxReturn,
//     )
//   })

//   it('should have one guard', () => {
//     expect(guards).toHaveLength(1)
//   })
// })
