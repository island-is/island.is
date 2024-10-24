import { SubpoenaExistsOptionalGuard } from '../../guards/subpoenaExists.guard'
import { SubpoenaController } from '../../subpoena.controller'

describe('SubpoenaController - Get subpoena pdf guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      SubpoenaController.prototype.getSubpoenaPdf,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(1)
    expect(new guards[0]()).toBeInstanceOf(SubpoenaExistsOptionalGuard)
  })
})
