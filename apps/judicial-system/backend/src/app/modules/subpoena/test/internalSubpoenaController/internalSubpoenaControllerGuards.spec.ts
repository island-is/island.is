import { TokenGuard } from '@island.is/judicial-system/auth'

import { InternalSubpoenaController } from '../../internalSubpoena.controller'

describe('InternalSubpoenaController - guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', InternalSubpoenaController)
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(TokenGuard)
  })
})
