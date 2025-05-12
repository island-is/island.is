import { CanActivate } from '@nestjs/common'

import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../../case'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Create guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      IndictmentCountController.prototype.create,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('MinimalCaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have MinimalCaseExistsGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(MinimalCaseExistsGuard)
    })
  })

  describe('MinimalCaseAccessGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have MinimalCaseAccessGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(MinimalCaseAccessGuard)
    })
  })
})
