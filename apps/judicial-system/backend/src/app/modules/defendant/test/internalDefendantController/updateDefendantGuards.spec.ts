import { DefendantNationalIdExistsGuard } from '../../guards/defendantNationalIdExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

describe('InternalDefendantController - Update defendant guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalDefendantController.prototype.updateDefendant,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(DefendantNationalIdExistsGuard)
  })
})
