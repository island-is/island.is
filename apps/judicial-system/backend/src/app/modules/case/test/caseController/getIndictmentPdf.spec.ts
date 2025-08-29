import { Response } from 'express'
import { uuid } from 'uuidv4'

import {
  CaseState,
  CaseType,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createIndictment } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'

jest.mock('../../../../formatters/indictmentPdf')

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CaseController - Get indictment pdf', () => {
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    policeCaseNumbers: [policeCaseNumber],
    indictmentSubtypes: {
      [policeCaseNumber]: [IndictmentSubtype.TRAFFIC_VIOLATION],
    },
    indictmentHash: uuid(),
  } as Case
  const pdf = Buffer.from(uuid())
  const res = { end: jest.fn() } as unknown as Response

  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, caseController } = await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    const mockGetObject = mockAwsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await caseController.getIndictmentPdf(caseId, theCase, res)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('pdf generated', () => {
    beforeEach(async () => {
      const getMock = createIndictment as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen()
    })

    it('should generate pdf after failing to get it from AWS S3', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        theCase.type,
        `${caseId}/indictment.pdf`,
      )
      expect(createIndictment).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
        undefined,
      )
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('pdf returned from AWS S3', () => {
    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

      await givenWhenThen()
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })
})
