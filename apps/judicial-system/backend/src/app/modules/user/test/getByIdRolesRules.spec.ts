import { adminRule, localAdminRule } from '../../../guards'
import { UserController } from '../user.controller'

describe('UserController - Get by id rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', UserController.prototype.getById)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(adminRule)
    expect(rules).toContain(localAdminRule)
  })
})
