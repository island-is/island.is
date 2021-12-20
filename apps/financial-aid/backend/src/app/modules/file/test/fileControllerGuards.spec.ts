import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'

import { FileController } from '../file.controller'

describe('FileController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', FileController)
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })
})
