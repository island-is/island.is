import { Response } from 'express'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createCaseFilesRecord } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile } from '../../../repository'

jest.mock('../../../../formatters/generatedPdfs/caseFilesRecordPdf')

interface Then {
  error: Error
}

type GivenWhenThen = (policeCaseNumber: string) => Promise<Then>

describe('LimitedAccessCaseController - Get case files record pdf', () => {
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const caseFiles = [
    {
      policeCaseNumber,
      category: CaseFileCategory.CASE_FILE_RECORD,
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
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    policeCaseNumbers: [uuid(), policeCaseNumber, uuid()],
    caseFiles,
  } as Case
  const user = { nationalId: '1234567890' } as TUser
  const pdf = Buffer.from(uuid())
  const res = { end: jest.fn() } as unknown as Response

  let mockawsS3Service: AwsS3Service
  let limitedAccessCaseController: Awaited<
    ReturnType<typeof createTestingCaseModule>
  >['limitedAccessCaseController']
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const module = await createTestingCaseModule()

    limitedAccessCaseController = module.limitedAccessCaseController
    mockawsS3Service = module.awsS3Service
    const mockGetObject = mockawsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockPutObject = mockawsS3Service.putObject as jest.Mock
    mockPutObject.mockRejectedValue(new Error('Some error'))
    const mockFindAll = module.policeDigitalCaseFileRepositoryService
      .findAll as jest.Mock
    mockFindAll.mockResolvedValue([])

    givenWhenThen = async (policeCaseNumber: string) => {
      const then = {} as Then

      try {
        await limitedAccessCaseController.getCaseFilesRecordPdf(
          caseId,
          policeCaseNumber,
          user,
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
      expect(mockawsS3Service.getObject).toHaveBeenCalledWith(
        theCase.type,
        `${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        expect.any(Array),
        expect.any(Array),
        expect.any(Function),
      )
      expect(mockawsS3Service.putObject).toHaveBeenCalledWith(
        theCase.type,
        `${caseId}/${policeCaseNumber}/caseFilesRecord.pdf`,
        pdf.toString('binary'),
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf returned from AWS S3', () => {
    beforeEach(async () => {
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

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

  describe('defender does not have access to police case number', () => {
    const otherDefenderPoliceCaseNumber = theCase.policeCaseNumbers[0]
    let then: Then

    beforeEach(async () => {
      const caseWithDefendants = {
        ...theCase,
        defendants: [
          {
            defenderNationalId: user.nationalId,
            isDefenderChoiceConfirmed: true,
            policeCaseNumbers: [policeCaseNumber],
          },
          {
            defenderNationalId: '9999999999',
            isDefenderChoiceConfirmed: true,
            policeCaseNumbers: [otherDefenderPoliceCaseNumber],
          },
        ],
      } as Case

      const then2 = {} as Then

      try {
        await limitedAccessCaseController.getCaseFilesRecordPdf(
          caseId,
          otherDefenderPoliceCaseNumber,
          user,
          caseWithDefendants,
          res,
        )
      } catch (error) {
        then2.error = error as Error
      }

      then = then2
    })

    it('should return ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toEqual(
        `Defence user does not have access to police case number ${otherDefenderPoliceCaseNumber}`,
      )
    })
  })

  describe('spokesperson does not have access to police case number', () => {
    const otherSpokespersonPoliceCaseNumber = theCase.policeCaseNumbers[0]
    let then: Then

    beforeEach(async () => {
      const caseWithCivilClaimants = {
        ...theCase,
        defendants: [
          {
            defenderNationalId: '8888888888',
            isDefenderChoiceConfirmed: true,
            policeCaseNumbers: [otherSpokespersonPoliceCaseNumber],
          },
        ],
        civilClaimants: [
          {
            hasSpokesperson: true,
            isSpokespersonConfirmed: true,
            caseFilesSharedWithSpokesperson: true,
            spokespersonNationalId: user.nationalId,
            policeCaseNumbers: [policeCaseNumber],
          },
          {
            hasSpokesperson: true,
            isSpokespersonConfirmed: true,
            caseFilesSharedWithSpokesperson: true,
            spokespersonNationalId: '9999999999',
            policeCaseNumbers: [otherSpokespersonPoliceCaseNumber],
          },
        ],
      } as Case

      const then2 = {} as Then

      try {
        await limitedAccessCaseController.getCaseFilesRecordPdf(
          caseId,
          otherSpokespersonPoliceCaseNumber,
          user,
          caseWithCivilClaimants,
          res,
        )
      } catch (error) {
        then2.error = error as Error
      }

      then = then2
    })

    it('should return ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toEqual(
        `Defence user does not have access to police case number ${otherSpokespersonPoliceCaseNumber}`,
      )
    })
  })
})
