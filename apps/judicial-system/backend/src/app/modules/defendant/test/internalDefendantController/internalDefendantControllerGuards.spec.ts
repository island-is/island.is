import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { CaseExistsGuard } from '../../../case'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

describe('InternalDefendantController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalDefendantController)
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('TokenGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have TokenGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(TokenGuard)
    })
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseExistsGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('Method level guards', () => {
    it('should have DefendantExistsGuard on deliverDefendantToCourt method', () => {
      const methodGuards = Reflect.getMetadata(
        '__guards__',
        InternalDefendantController.prototype.deliverDefendantToCourt,
      )
      expect(methodGuards).toHaveLength(1)
      const guard = new methodGuards[0]()
      expect(guard).toBeInstanceOf(DefendantExistsGuard)
    })
  })
})
