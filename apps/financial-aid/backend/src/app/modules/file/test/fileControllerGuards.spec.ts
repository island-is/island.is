import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CanActivate } from '@nestjs/common'
import { RolesGuard } from '../../../guards/roles.guard'

import { FileController } from '../file.controller'

describe('FileController - guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata('__guards__', FileController)
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

describe('FileController - Creates a new signed url guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createSignedUrl,
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

describe('FileController - Creates a new signed url guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createSignedUrlForId,
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

describe('FileController - Creates a new signed url guards', () => {
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.createFiles,
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
