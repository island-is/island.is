import { firstValueFrom, of } from 'rxjs'
import { v4 as uuid } from 'uuid'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  indictmentCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { LimitedAccessCaseFileInterceptor } from '../limitedAccessCaseFile.interceptor'

interface Then {
  result: unknown
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('LimitedAccessCaseFileInterceptor', () => {
  const mockRequest = jest.fn()
  const mockHandle = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = async (): Promise<Then> => {
      const interceptor = new LimitedAccessCaseFileInterceptor()
      const then = {} as Then

      await firstValueFrom(
        interceptor.intercept(
          {
            switchToHttp: () => ({ getRequest: mockRequest }),
          } as unknown as ExecutionContext,
          { handle: mockHandle } as unknown as CallHandler,
        ),
      )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('criminal record filtering', () => {
    describe.each(indictmentCases)('for %s cases', (type) => {
      describe('defender assigned to defendant', () => {
        let then: Then

        beforeEach(async () => {
          const nationalId = uuid()
          const defendantId = uuid()
          const theCase = {
            type: type as CaseType,
            state: CaseState.COMPLETED,
            defendants: [
              {
                id: defendantId,
                defenderNationalId: nationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
            ],
            caseFiles: [
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD,
                defendantId,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
            ],
          }

          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
          }))
          mockHandle.mockReturnValueOnce(of(theCase))

          then = await givenWhenThen()
        })

        it('should include criminal record file', () => {
          const result = then.result as { caseFiles: unknown[] }
          expect(result.caseFiles).toHaveLength(1)
          expect(result.caseFiles[0]).toHaveProperty(
            'category',
            CaseFileCategory.CRIMINAL_RECORD,
          )
        })
      })

      describe('defender not assigned to defendant', () => {
        let then: Then

        beforeEach(async () => {
          const defenderNationalId = uuid()
          const otherDefenderNationalId = uuid()
          const defendantId = uuid()
          const theCase = {
            type: type as CaseType,
            state: CaseState.COMPLETED,
            defendants: [
              {
                id: defendantId,
                defenderNationalId: otherDefenderNationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
            ],
            caseFiles: [
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD,
                defendantId,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
            ],
          }

          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: {
                role: UserRole.DEFENDER,
                nationalId: defenderNationalId,
              },
            },
          }))
          mockHandle.mockReturnValueOnce(of(theCase))

          then = await givenWhenThen()
        })

        it('should filter out criminal record file', () => {
          const result = then.result as { caseFiles: unknown[] }
          expect(result.caseFiles).toHaveLength(0)
        })
      })

      describe('criminal record without defendantId (backward compatibility)', () => {
        let then: Then

        beforeEach(async () => {
          const nationalId = uuid()
          const theCase = {
            type: type as CaseType,
            state: CaseState.COMPLETED,
            defendants: [
              {
                id: uuid(),
                defenderNationalId: nationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
            ],
            caseFiles: [
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD,
                defendantId: undefined,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
            ],
          }

          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
          }))
          mockHandle.mockReturnValueOnce(of(theCase))

          then = await givenWhenThen()
        })

        it('should include criminal record file for backward compatibility', () => {
          const result = then.result as { caseFiles: unknown[] }
          expect(result.caseFiles).toHaveLength(1)
          expect(result.caseFiles[0]).toHaveProperty(
            'category',
            CaseFileCategory.CRIMINAL_RECORD,
          )
        })
      })

      describe('criminal record update with defendantId', () => {
        let then: Then

        beforeEach(async () => {
          const nationalId = uuid()
          const defendantId = uuid()
          const theCase = {
            type: type as CaseType,
            state: CaseState.COMPLETED,
            defendants: [
              {
                id: defendantId,
                defenderNationalId: nationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
            ],
            caseFiles: [
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
                defendantId,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
            ],
          }

          mockRequest.mockImplementationOnce(() => ({
            user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
          }))
          mockHandle.mockReturnValueOnce(of(theCase))

          then = await givenWhenThen()
        })

        it('should include criminal record update file', () => {
          const result = then.result as { caseFiles: unknown[] }
          expect(result.caseFiles).toHaveLength(1)
          expect(result.caseFiles[0]).toHaveProperty(
            'category',
            CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          )
        })
      })

      describe('multiple criminal records for different defendants', () => {
        let then: Then

        beforeEach(async () => {
          const defender1NationalId = uuid()
          const defender2NationalId = uuid()
          const defendant1Id = uuid()
          const defendant2Id = uuid()
          const theCase = {
            type: type as CaseType,
            state: CaseState.COMPLETED,
            defendants: [
              {
                id: defendant1Id,
                defenderNationalId: defender1NationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
              {
                id: defendant2Id,
                defenderNationalId: defender2NationalId,
                isDefenderChoiceConfirmed: true,
                caseFilesSharedWithDefender: true,
              },
            ],
            caseFiles: [
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD,
                defendantId: defendant1Id,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
              {
                id: uuid(),
                category: CaseFileCategory.CRIMINAL_RECORD,
                defendantId: defendant2Id,
                submittedBy: 'test',
                fileRepresentative: 'test',
              },
            ],
          }

          mockRequest.mockImplementationOnce(() => ({
            user: {
              currentUser: {
                role: UserRole.DEFENDER,
                nationalId: defender1NationalId,
              },
            },
          }))
          mockHandle.mockReturnValueOnce(of(theCase))

          then = await givenWhenThen()
        })

        it('should only include criminal record for assigned defendant', () => {
          const result = then.result as { caseFiles: unknown[] }
          expect(result.caseFiles).toHaveLength(1)
          expect(result.caseFiles[0]).toHaveProperty(
            'category',
            CaseFileCategory.CRIMINAL_RECORD,
          )
        })
      })
    })
  })

  describe('non-criminal record files', () => {
    let then: Then

    beforeEach(async () => {
      const nationalId = uuid()
      const theCase = {
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
        defendants: [
          {
            id: uuid(),
            defenderNationalId: nationalId,
            isDefenderChoiceConfirmed: true,
            caseFilesSharedWithDefender: true,
          },
        ],
        caseFiles: [
          {
            id: uuid(),
            category: CaseFileCategory.COURT_RECORD,
            submittedBy: 'test',
            fileRepresentative: 'test',
          },
        ],
      }

      mockRequest.mockImplementationOnce(() => ({
        user: { currentUser: { role: UserRole.DEFENDER, nationalId } },
      }))
      mockHandle.mockReturnValueOnce(of(theCase))

      then = await givenWhenThen()
    })

    it('should not filter non-criminal record files', () => {
      const result = then.result as { caseFiles: unknown[] }
      expect(result.caseFiles).toHaveLength(1)
      expect(result.caseFiles[0]).toHaveProperty(
        'category',
        CaseFileCategory.COURT_RECORD,
      )
    })
  })
})
