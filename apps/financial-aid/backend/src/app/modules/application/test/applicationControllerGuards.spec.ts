import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { RolesGuard } from '../../../guards/roles.guard'

import { ApplicationController } from '../application.controller'

describe('ApplicationController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', ApplicationController)
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

describe('ApplicationController - Checks if user has a current application for this period guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.getCurrentApplication,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Searches for application by nationalId guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.findApplication,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Checking if user is spouse guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.spouse,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Gets all existing applications guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.getAll,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Get application guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.getById,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})

describe('ApplicationController - Gets all existing applications filters guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.getAllFilters,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Updates an existing application and returns application table guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.updateTable,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})

describe('ApplicationController - Creates a new application guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      ApplicationController.prototype.create,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('RolesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have RolesGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(RolesGuard)
    })
  })
})
