import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { CaseType } from '@island.is/judicial-system/types'

import { CreateCaseDto } from '../../dto/createCase.dto'
import { DeprecatedInternalCreateCaseDto } from '../../dto/deprecatedInternalCreateCase.dto'
import { InternalCreateCaseDto } from '../../dto/internalCreateCase.dto'
import { UpdateCaseDto } from '../../dto/updateCase.dto'

const policeCaseNumberErrors = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dto: new (...args: any[]) => object,
  plain: Record<string, unknown>,
) =>
  validateSync(plainToInstance(dto, plain)).filter(
    (error) => error.property === 'policeCaseNumbers',
  )

describe('police case number validation', () => {
  describe.each([
    [
      'CreateCaseDto',
      CreateCaseDto,
      { type: CaseType.CUSTODY } as Record<string, unknown>,
    ],
    [
      'InternalCreateCaseDto',
      InternalCreateCaseDto,
      {
        type: CaseType.CUSTODY,
        prosecutorNationalId: '1234567890',
        accusedNationalId: '1234567890',
      } as Record<string, unknown>,
    ],
    [
      'DeprecatedInternalCreateCaseDto',
      DeprecatedInternalCreateCaseDto,
      {
        type: CaseType.CUSTODY,
        prosecutorNationalId: '1234567890',
        accusedNationalId: '1234567890',
      } as Record<string, unknown>,
    ],
  ])('%s', (_, dto, rest) => {
    it('should accept correctly formatted police case numbers', () => {
      const errors = policeCaseNumberErrors(dto, {
        ...rest,
        policeCaseNumbers: ['007-2024-042535', '007-2024-1'],
      })

      expect(errors).toHaveLength(0)
    })

    it('should reject a police case number with a too long last part', () => {
      const errors = policeCaseNumberErrors(dto, {
        ...rest,
        policeCaseNumbers: ['007-2024-1234567'],
      })

      expect(errors).toHaveLength(1)
    })

    it('should reject a police case number which has not been finished', () => {
      const errors = policeCaseNumberErrors(dto, {
        ...rest,
        policeCaseNumbers: ['007-2024-'],
      })

      expect(errors).toHaveLength(1)
    })

    it('should reject an empty police case number', () => {
      const errors = policeCaseNumberErrors(dto, {
        ...rest,
        policeCaseNumbers: [''],
      })

      expect(errors).toHaveLength(1)
    })

    it('should reject a malformed police case number among valid ones', () => {
      const errors = policeCaseNumberErrors(dto, {
        ...rest,
        policeCaseNumbers: ['007-2024-042535', '007-2024-1234567'],
      })

      expect(errors).toHaveLength(1)
    })
  })

  describe('UpdateCaseDto', () => {
    it('should accept correctly formatted police case numbers', () => {
      const errors = policeCaseNumberErrors(UpdateCaseDto, {
        policeCaseNumbers: ['007-2024-042535', '007-2024-1'],
      })

      expect(errors).toHaveLength(0)
    })

    it('should reject an empty police case number, which is a police case the user has not filled in yet', () => {
      // An empty police case number is dropped when it is stored, but it is
      // still counted as a new police case, which adds an indictment count
      // with no police case number to the case
      const errors = policeCaseNumberErrors(UpdateCaseDto, {
        policeCaseNumbers: ['007-2024-042535', ''],
      })

      expect(errors).toHaveLength(1)
    })

    it('should reject a police case number with a too long last part', () => {
      const errors = policeCaseNumberErrors(UpdateCaseDto, {
        policeCaseNumbers: ['007-2024-1234567'],
      })

      expect(errors).toHaveLength(1)
    })

    it('should reject a police case number which has not been finished', () => {
      const errors = policeCaseNumberErrors(UpdateCaseDto, {
        policeCaseNumbers: ['007-2024-'],
      })

      expect(errors).toHaveLength(1)
    })

    it('should ignore police case numbers when they are not being updated', () => {
      const errors = policeCaseNumberErrors(UpdateCaseDto, {
        description: 'Some description',
      })

      expect(errors).toHaveLength(0)
    })
  })
})
