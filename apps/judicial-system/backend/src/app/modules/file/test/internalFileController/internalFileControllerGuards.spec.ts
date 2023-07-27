import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalFileController)
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
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
})
