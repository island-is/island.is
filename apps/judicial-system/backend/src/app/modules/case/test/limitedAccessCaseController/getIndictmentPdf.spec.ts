import { Response } from 'express'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

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

type GivenWhenThen = (caseOverride?: Case) => Promise<Then>

describe('LimitedCaseController - Get indictment pdf', () => {
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
    defendants: [{ id: uuid(), name: 'Test Defendant' }],
  } as Case
  const pdf = Buffer.from(uuid())
  const res = { end: jest.fn() } as unknown as Response

  let mockawsS3Service: AwsS3Service
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, awsS3Service, limitedAccessCaseController } =
      await createTestingCaseModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockawsS3Service = awsS3Service
    const mockGetObject = mockawsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseOverride?: Case) => {
      const then = {} as Then
      const caseToUse = caseOverride ?? theCase

      try {
        await limitedAccessCaseController.getIndictmentPdf(
          caseToUse.id,
          caseToUse,
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
      const getMock = createIndictment as jest.Mock
      getMock.mockResolvedValueOnce(pdf)

      await givenWhenThen()
    })

    it('should generate pdf', () => {
      expect(mockawsS3Service.getObject).toHaveBeenCalledWith(
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
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

      await givenWhenThen()
    })

    it('should return pdf', () => {
      expect(res.end).toHaveBeenCalledWith(pdf)
    })
  })

  describe('when case has 0 defendants', () => {
    it('should throw BadRequestException and not call createIndictment', async () => {
      ;(createIndictment as jest.Mock).mockClear()

      const caseWithNoDefendants = {
        ...theCase,
        defendants: [],
      } as unknown as Case

      const then = await givenWhenThen(caseWithNoDefendants)

      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error?.message).toContain(
        'Cannot generate indictment PDF without at least one defendant',
      )
      expect(createIndictment).not.toHaveBeenCalled()
    })
  })
})
