import { Response } from 'express'
import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { CaseFileCategory, CaseState } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createCaseFilesRecord } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { CaseFile } from '../../../file'
import { Case } from '../../models/case.model'

jest.mock('../../../../formatters/caseFilesRecordPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (policeCaseNumber: string) => Promise<Then>

describe('CaseController - Get case files record pdf', () => {
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
    state: CaseState.ACCEPTED,
    policeCaseNumbers: [uuid(), policeCaseNumber, uuid()],
    caseFiles,
  } as Case
  const pdf = uuid()
  const res = { end: jest.fn() } as unknown as Response

  let mockawsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, caseController } = await createTestingCaseModule()

    mockawsS3Service = awsS3Service
    const mockGetObject = mockawsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (policeCaseNumber: string) => {
      const then = {} as Then

      try {
        await caseController.getCaseFilesRecordPdf(
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
    beforeEach(async () => {
      const getMock = createCaseFilesRecord as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen(policeCaseNumber)
    })

    it('should generate pdf after failing to get it from AWS S3', () => {
      expect(mockawsS3Service.getObject).toHaveBeenNthCalledWith(
        1,
        `indictments/completed/${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      expect(mockawsS3Service.getObject).toHaveBeenNthCalledWith(
        2,
        `indictments/${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        expect.any(Array),
        expect.any(Function),
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf returned from AWS S3 indictment completed folder', () => {
    beforeEach(async () => {
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockReturnValueOnce(pdf)

      await givenWhenThen(policeCaseNumber)
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf returned from AWS S3 indictment folder', () => {
    beforeEach(async () => {
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some error'))
      mockGetObject.mockReturnValueOnce(pdf)

      await givenWhenThen(policeCaseNumber)
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('police case number not included in case', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(policeCaseNumber)
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })
})
