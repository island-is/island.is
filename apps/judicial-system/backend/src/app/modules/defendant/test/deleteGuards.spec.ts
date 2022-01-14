import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../case'
import { DefendantExistsGuard } from '../guards/defendantExists.guard'
import { DefendantController } from '../defendant.controller'

describe('DefendantController - Delete guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      DefendantController.prototype.delete,
    )
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
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

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseWriteGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })

  describe('DefendantExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseWriteGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(DefendantExistsGuard)
    })
  })
})
