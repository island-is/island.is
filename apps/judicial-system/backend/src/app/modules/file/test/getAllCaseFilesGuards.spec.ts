import { CanActivate } from '@nestjs/common'

import { CaseExistsGuard, CaseReadGuard } from '../../case'
import { FileController } from '../file.controller'

describe('FileController - Get all case files guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      FileController.prototype.getAllCaseFiles,
    )
  })

  it('should have two guards', () => {
    expect(guards).toHaveLength(2)
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseReadGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[1]()
    })

    it('should have CaseReadGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseReadGuard)
    })
  })
})
