import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { ApplicationGuard } from '../../../guards/application.guard'
import { StaffGuard } from '../../../guards/staff.guard'

import { ApplicationController } from '../application.controller'

describe('ApplicationController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', ApplicationController)
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('IdsUserGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have IdsUserGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(IdsUserGuard)
    })
  })

  describe('ScopesGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have ScopesGuard as guard 1', () => {
      expect(guard).toBeInstanceOf(ScopesGuard)
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

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have StaffGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(StaffGuard)
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

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('ApplicationGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have ApplicationGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(ApplicationGuard)
    })
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

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have StaffGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(StaffGuard)
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

  it('should have one guard', () => {
    expect(guards).toHaveLength(1)
  })

  describe('StaffGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have StaffGuard as guard 0', () => {
      expect(guard).toBeInstanceOf(StaffGuard)
    })
  })
})
