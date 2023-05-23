import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../case'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Delete guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      IndictmentCountController.prototype.delete,
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

    it('should have CaseExistsGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseWriteGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseWriteGuard as guard 2', () => {
      expect(guard).toBeInstanceOf(CaseWriteGuard)
    })
  })

  describe('IndictmentCountExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseWriteGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(IndictmentCountExistsGuard)
    })
  })
})
