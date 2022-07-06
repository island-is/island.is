import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { StaffGuard } from '../../../guards/staff.guard'

import { MunicipalityController } from '../municipality.controller'
describe('MunicipalityController - Get guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', MunicipalityController)
  })

  it('should have one guard', () => {
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

describe('MunicipalityController - Get Creates a new municipality guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      MunicipalityController.prototype.create,
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

describe('MunicipalityController - Gets municipalities guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      MunicipalityController.prototype.getAllMunicipalities,
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

describe('MunicipalityController - Gets Updates municipality guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      MunicipalityController.prototype.updateMunicipality,
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

describe('MunicipalityController - Gets Updates activity for municipality guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      MunicipalityController.prototype.updateMunicipalityActivity,
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
