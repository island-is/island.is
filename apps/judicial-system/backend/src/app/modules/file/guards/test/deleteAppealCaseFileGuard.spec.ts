import { v4 as uuid } from 'uuid'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseFileCategory,
  partyAppealFileCategories,
} from '@island.is/judicial-system/types'

import { DeleteAppealCaseFileGuard } from '../deleteAppealCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Delete Appeal Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new DeleteAppealCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each(partyAppealFileCategories)(
    'appeal case file of category %s',
    (category) => {
      describe('the court of appeals has not registered its case number', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            case: { appealCase: { id: uuid() } },
            caseFile: { category },
          }))

          then = givenWhenThen()
        })

        it('should activate', () => {
          expect(then.result).toBe(true)
        })
      })

      describe('the court of appeals has registered its case number', () => {
        let then: Then

        beforeEach(() => {
          mockRequest.mockImplementationOnce(() => ({
            case: { appealCase: { id: uuid(), appealCaseNumber: '1/2025' } },
            caseFile: { category },
          }))

          then = givenWhenThen()
        })

        it('should throw ForbiddenException', () => {
          expect(then.error).toBeInstanceOf(ForbiddenException)
          expect(then.error.message).toBe(
            'Forbidden when the court of appeals has registered its case number',
          )
        })
      })
    },
  )

  describe.each(
    Object.values(CaseFileCategory).filter(
      (category) => !partyAppealFileCategories.includes(category),
    ),
  )('other case file category %s', (category) => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        case: { appealCase: { id: uuid(), appealCaseNumber: '1/2025' } },
        caseFile: { category },
      }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('ruling order appeal case file', () => {
    const rulingFileId = uuid()

    describe('its own appeal case has no case number', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          case: {
            appealCase: { id: uuid(), appealCaseNumber: '1/2025' },
            rulingOrderAppealCases: [{ id: uuid(), rulingFileId }],
          },
          caseFile: {
            category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
            rulingFileId,
          },
        }))

        then = givenWhenThen()
      })

      it('should activate', () => {
        expect(then.result).toBe(true)
      })
    })

    describe('its own appeal case has a case number', () => {
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({
          case: {
            appealCase: { id: uuid() },
            rulingOrderAppealCases: [
              { id: uuid(), rulingFileId, appealCaseNumber: '1/2025' },
            ],
          },
          caseFile: {
            category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
            rulingFileId,
          },
        }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })
  })

  describe('missing case', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({
        caseFile: { category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT },
      }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })

  describe('missing case file', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ case: { id: uuid() } }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case file')
    })
  })
})
