import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseWriteGuard } from '../../case'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from '../guards/offenseExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Delete offense guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      IndictmentCountController.prototype.deleteOffense,
    )
  })

  it('should have four guards', () => {
    expect(guards).toHaveLength(4)
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

    it('should have IndictmentCountExistsGuard as guard 3', () => {
      expect(guard).toBeInstanceOf(IndictmentCountExistsGuard)
    })
  })

  describe('OffenseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[3]()
    })

    it('should have OffenseExistsGuard as guard 4', () => {
      expect(guard).toBeInstanceOf(OffenseExistsGuard)
    })
  })
})
