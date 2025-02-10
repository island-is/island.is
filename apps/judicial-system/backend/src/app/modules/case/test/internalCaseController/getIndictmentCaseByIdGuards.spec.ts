import { IndictmentCaseExistsForDefendantGuard } from '../../guards/indictmentCaseExistsForDefendant.guard'
import { InternalCaseController } from '../../internalCase.controller'

describe('InternalCaseController - Get defendant indictment case by id guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.getDefendantIndictmentCaseById,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(
      IndictmentCaseExistsForDefendantGuard,
    )
  })
})
