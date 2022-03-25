import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { StaffGuard } from '../../../guards/staff.guard'

import { FileController } from '../file.controller'

describe('FileController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', FileController)
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

    describe('ScopesGuard', () => {
      let guard: CanActivate

      beforeEach(() => {
        guard = new guards[1]()
      })

      it('should have ScopesGuard as guard 1', () => {
        expect(guard).toBeInstanceOf(ScopesGuard)
      })
    })
  })

  describe('FileController - Creates a new signed url for id guards', () => {
    let guards: any[]

    beforeEach(() => {
      guards = Reflect.getMetadata(
        '__guards__',
        FileController.prototype.createSignedUrlForId,
      )
    })

    it('should have one guard', () => {
      expect(guards).toHaveLength(1)
    })

    describe('StaffGuard', () => {
      let guard: CanActivate

      beforeEach(() => {
        guard = new guards[0]()
      })

      it('should have StaffGuard as guard 0', () => {
        expect(guard).toBeInstanceOf(StaffGuard)
      })
    })
  })
})
