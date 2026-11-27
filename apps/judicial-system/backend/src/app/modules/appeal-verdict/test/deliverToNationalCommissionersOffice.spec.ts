import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  AppealCaseState,
  CaseFileCategory,
  HashAlgorithm,
  PoliceFileTypeCode,
} from '@island.is/judicial-system/types'

import { createTestingAppealVerdictModule } from './createTestingAppealVerdictModule'

import { getCaseFileHash } from '../../../formatters'
import { FileService } from '../../file'
import { PoliceService } from '../../police/police.service'
import {
  AppealVerdict,
  Case,
  CaseRepositoryService,
  Defendant,
} from '../../repository'
import { DeliverDto } from '../dto/deliver.dto'
import { InternalAppealVerdictController } from '../internalAppealVerdict.controller'
import { DeliverResponse } from '../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseToDeliver?: Case) => Promise<Then>

describe('InternalAppealVerdictController - Deliver appeal verdict to national commissioners office', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const appealVerdictId = uuid()
  const appealCaseId = uuid()
  const appealCaseNumber = 'L-100/2026'
  const appealRulingDate = new Date(2026, 2, 15)

  const caseFiles = [
    {
      name: 'Dómur Landsréttar',
      created: new Date(2026, 2, 15),
      category: CaseFileCategory.VERDICT_APPEAL_RULING,
      hash: 'hash',
      hashAlgorithm: 'SHA-256',
    },
  ]

  const buffer = Buffer.from('Dómur Landsréttar')

  const appealVerdict = {
    id: appealVerdictId,
    caseId,
    appealCaseId,
    defendantId,
    sentToServiceDate: new Date(2026, 2, 16),
  } as AppealVerdict

  const defendant = {
    id: defendantId,
    nationalId: '0000000000',
    appealVerdicts: [appealVerdict],
  } as Defendant

  const theCase = {
    id: caseId,
    defendants: [defendant],
    courtCaseNumber: 'S-1/2025',
    policeCaseNumbers: ['007-2025-1'],
    caseFiles,
    verdictAppealCase: {
      id: appealCaseId,
      appealCaseNumber,
      appealRulingDate,
      appealState: AppealCaseState.COMPLETED,
    },
    prosecutorsOffice: { name: 'Lögreglustjórinn á höfuðborgarsvæðinu' },
  } as Case

  const user = { id: uuid() }
  const dto = { user } as DeliverDto

  let mockPoliceService: PoliceService
  let mockFileService: FileService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockAppealVerdictRepositoryService: {
    findByIdForUpdate: jest.Mock
    update: jest.Mock
  }
  let transaction: Transaction
  let internalAppealVerdictController: InternalAppealVerdictController

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const testingModule = await createTestingAppealVerdictModule()

    mockPoliceService = testingModule.policeService
    mockCaseRepositoryService = testingModule.caseRepositoryService
    mockAppealVerdictRepositoryService =
      testingModule.appealVerdictRepositoryService as unknown as {
        findByIdForUpdate: jest.Mock
        update: jest.Mock
      }
    internalAppealVerdictController =
      testingModule.internalAppealVerdictController
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
    ;(testingModule.sequelize.transaction as jest.Mock).mockResolvedValue(
      transaction,
    )

    mockAppealVerdictRepositoryService.findByIdForUpdate.mockResolvedValue(
      appealVerdict,
    )
    mockAppealVerdictRepositoryService.update.mockResolvedValue(appealVerdict)

    const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    mockFileService = testingModule.fileService
    const mockGetCaseFileFromS3 = mockFileService.getCaseFileFromS3 as jest.Mock
    mockGetCaseFileFromS3.mockResolvedValue(buffer)

    givenWhenThen = async (caseToDeliver = theCase): Promise<Then> => {
      const then = {} as Then

      await internalAppealVerdictController
        .deliverAppealVerdictToNationalCommissionersOffice(
          caseToDeliver.id,
          appealVerdictId,
          caseToDeliver,
          appealVerdict,
          dto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('appeal verdict delivered to police central file system', () => {
    const createDocumentResponse = { externalPoliceDocumentId: uuid() }

    beforeEach(async () => {
      const mockCreateDocument = mockPoliceService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValue(createDocumentResponse)

      await givenWhenThen()
    })

    it('should walk to the original ancestor in the delivery transaction', () => {
      expect(
        mockCaseRepositoryService.findOriginalAncestorId,
      ).toHaveBeenCalledWith(theCase, { transaction })
    })

    it('should call createDocument with COA verdict file type', () => {
      expect(mockPoliceService.createDocument).toHaveBeenCalledWith({
        caseId,
        defendantId,
        user,
        documentName: `Dómur Landsréttar í máli ${appealCaseNumber}`,
        documentFiles: [
          {
            name: 'Dómur Landsréttar',
            documentBase64: 'RMOzbXVyIExhbmRzcsOpdHRhcg==',
          },
        ],
        documentDates: [
          { code: 'ORDER_BY_DATE', value: new Date(2026, 4, 16) },
          { code: 'RULING_DATE', value: appealRulingDate },
        ],
        fileTypeCode: PoliceFileTypeCode.APPEAL_VERDICT,
        caseSupplements: [
          { code: 'RVG_CASE_ID', value: caseId },
          { code: 'RVG_DOCUMENT_ID', value: appealVerdictId },
          { code: 'RECEIVER_SSN', value: '0000000000' },
          { code: 'RECEIVER_TYPE', value: 'DEFENDANT' },
          { code: 'VERDICT_COURT_CASE_NUMBER', value: appealCaseNumber },
          { code: 'POLICE_CASE_NUMBERS', value: '007-2025-1' },
          {
            code: 'PROSECUTOR_OFFICE',
            value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
          },
        ],
      })
    })

    it('should persist the police document id and hash of the sent buffer', () => {
      const { hash, hashAlgorithm } = getCaseFileHash(buffer)

      expect(mockAppealVerdictRepositoryService.update).toHaveBeenCalledWith(
        appealVerdictId,
        {
          ...createDocumentResponse,
          hash,
          hashAlgorithm,
        },
        { transaction },
      )
      expect(hashAlgorithm).toBe(HashAlgorithm.SHA256)
    })

    it('should commit the transaction', () => {
      expect(transaction.commit).toHaveBeenCalled()
    })
  })

  describe('appeal verdict already has a police document id', () => {
    let then: Then

    beforeEach(async () => {
      mockAppealVerdictRepositoryService.findByIdForUpdate.mockResolvedValue({
        ...appealVerdict,
        externalPoliceDocumentId: uuid(),
      })

      then = await givenWhenThen()
    })

    it('skips CreateDocument when the police document id is already set', () => {
      expect(mockPoliceService.createDocument).not.toHaveBeenCalled()
      expect(mockAppealVerdictRepositoryService.update).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
      expect(transaction.commit).toHaveBeenCalled()
    })
  })

  describe('verdict appeal is not completed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        ...theCase,
        verdictAppealCase: {
          ...theCase.verdictAppealCase,
          appealState: AppealCaseState.RECEIVED,
        },
      } as Case)
    })

    it('should reject delivery before calling police', () => {
      expect(mockPoliceService.createDocument).not.toHaveBeenCalled()
      expect(transaction.rollback).toHaveBeenCalled()
      expect(then.error).toBeDefined()
      expect(then.result).toBeUndefined()
    })
  })

  describe('delivery fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should roll back and rethrow', () => {
      expect(transaction.rollback).toHaveBeenCalled()
      expect(then.error).toBeDefined()
      expect(then.result).toBeUndefined()
    })
  })
})
