import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common/exceptions'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getCustodyNoticePdfAsBuffer } from '../../../../formatters'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/custodyNoticePdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('CaseController - Get custody pdf', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, theCase: Case, res: Response) => {
      const then = {} as Then

      try {
        await caseController.getCustodyNoticePdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
    } as Case
    const res = {} as Response

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(getCustodyNoticePdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })
  })

  describe('pdf returned for custody cases', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf returned for admission to facility cases', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
    } as Case
    const res = { end: jest.fn() } as unknown as Response
    const pdf = {}

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase, res)
    })

    it('should generate pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
    } as Case
    let then: Then
    const res = {} as Response

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('bad request because case has wrong state', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: CaseState.SUBMITTED,
    } as Case
    let then: Then
    const res = {} as Response
    const pdf = {}

    beforeEach(async () => {
      const getMock = getCustodyNoticePdfAsBuffer as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, theCase, res)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Cannot generate a custody notice for ${theCase.state} cases`,
      )
    })
  })
})
