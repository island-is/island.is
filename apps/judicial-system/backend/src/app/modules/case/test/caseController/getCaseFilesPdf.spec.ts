import { uuid } from 'uuidv4'
import { Response } from 'express'

import { BadRequestException } from '@nestjs/common'

import { CaseFileCategory } from '@island.is/judicial-system/types'

import { randomDate } from '../../../../test'
import { createCaseFilesRecord } from '../../../../formatters'
import { CaseFile } from '../../../file'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

jest.mock('../../../../formatters/caseFilesRecordPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  policeCaseNumber: string,
  theCase: Case,
  res: Response,
) => Promise<Then>

describe('CaseController - Get case files pdf', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (
      caseId: string,
      policeCaseNumber: string,
      theCase: Case,
      res: Response,
    ) => {
      const then = {} as Then

      try {
        await caseController.getCaseFilesPdf(
          caseId,
          policeCaseNumber,
          theCase,
          res,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const caseFiles = [
      {
        policeCaseNumber,
        category: CaseFileCategory.CASE_FILE,
        type: 'application/pdf',
        key: uuid(),
        chapter: 0,
        orderWithinChapter: 0,
        displayDate: randomDate(),
        userGeneratedFilename: uuid(),
      },
    ] as CaseFile[]
    const theCase = {
      id: caseId,
      policeCaseNumbers: [uuid(), policeCaseNumber, uuid()],
      caseFiles,
    } as Case
    const pdf = uuid()
    const res = ({ end: jest.fn() } as unknown) as Response

    beforeEach(async () => {
      const getMock = createCaseFilesRecord as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, policeCaseNumber, theCase, res)
    })

    it('should generate pdf', () => {
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        expect.any(Array),
        expect.any(Function),
      )
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('police case number not included in case', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const theCase = {
      id: caseId,
      policeCaseNumbers: [uuid(), uuid(), uuid()],
    } as Case
    const res = {} as Response
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase, res)
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })
})
