import { CanActivate } from '@nestjs/common'

import { JwtAuthUserGuard } from '@island.is/judicial-system/auth'

import { UserController } from '../user.controller'

describe('UserController - Get all guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', UserController.prototype.getAll)
  })

  it('should have guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('JwtAuthUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthUserGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthUserGuard)
    })
  })
})
