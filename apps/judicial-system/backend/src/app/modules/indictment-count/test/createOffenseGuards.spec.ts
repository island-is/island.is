import { CanActivate } from '@nestjs/common'

import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../../case'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Create offense guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      IndictmentCountController.prototype.createOffense,
    )
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
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

  describe('IndictmentCountExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have IndictmentCountExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(IndictmentCountExistsGuard)
    })
  })
})
