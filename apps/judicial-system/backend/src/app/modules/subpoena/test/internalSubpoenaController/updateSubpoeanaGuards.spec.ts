import { PoliceSubpoenaExistsGuard } from '../../guards/policeSubpoenaExists.guard'
import { InternalSubpoenaController } from '../../internalSubpoena.controller'

describe('InternalSubpoenaController - Update subpoena  guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalSubpoenaController.prototype.updateSubpoena,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(PoliceSubpoenaExistsGuard)
  })
})
