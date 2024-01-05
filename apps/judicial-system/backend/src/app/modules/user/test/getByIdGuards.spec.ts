import { CanActivate } from '@nestjs/common'

import { JwtAuthGuard } from '@island.is/judicial-system/auth'

import { UserController } from '../user.controller'

describe('UserController - Get by id guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', UserController.prototype.getById)
  })

  it('should have guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('JwtAuthGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have JwtAuthGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(JwtAuthGuard)
    })
  })
})
