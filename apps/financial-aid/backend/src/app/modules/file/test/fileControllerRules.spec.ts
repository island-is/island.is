import { RolesRule } from '@island.is/financial-aid/shared/lib'

import { FileController } from '../file.controller'

describe('FileController - Get Creates a new signed url rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.createSignedUrl,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to applicant', () => {
    expect(rules).toContain(RolesRule.OSK)
  })
})

describe('FileController - Get Creates a new signed url rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.createSignedUrlForId,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(RolesRule.VEITA)
  })
})

describe('FileController - Get Uploads files rules', () => {
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.createFiles,
    )
  })
  it('should have one rule', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to applicant', () => {
    expect(rules).toContain(RolesRule.OSK)
  })
})
