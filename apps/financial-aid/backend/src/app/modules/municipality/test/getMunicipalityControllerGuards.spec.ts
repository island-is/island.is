import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'

import { MunicipalityController } from '../municipality.controller'
describe('MunicipalityController - Get guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', MunicipalityController)
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

describe('MunicipalityController - Get Creates a new municipality guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      MunicipalityController.prototype.create,
    )
  })

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
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

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
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

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
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

  it('should have one guards', () => {
    expect(guards).toHaveLength(1)
  })
})
