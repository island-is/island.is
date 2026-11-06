import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  DocumentDeliveryReceiverType,
  DocumentDeliverySupplementCode,
  InstitutionType,
  PoliceFileTypeCode,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { PdfService } from '../../case'
import { PoliceService } from '../../police'
import {
  AppealSummons,
  AppealSummonsRepositoryService,
  AppealSummonsServiceRecipient,
  Case,
  CaseRepositoryService,
} from '../../repository'
import { AppealSummonsService } from '../appealSummons.service'

describe('AppealSummonsService - Deliver to national commissioners office', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const serviceId = uuid()
  const defendantId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as User

  const theCase = {
    id: caseId,
    courtCaseNumber: 'S-1/2026',
    policeCaseNumbers: ['007-2026-1'],
    rulingDate: new Date('2026-05-01T00:00:00.000Z'),
    prosecutorsOffice: { name: 'Lögreglustjórinn á höfuðborgarsvæðinu' },
    defendants: [
      {
        id: defendantId,
        nationalId: '0000000000',
        name: 'Jón Jónsson',
      },
    ],
  } as Case

  const summons = {
    id: summonsId,
    caseId,
    defendants: [{ defendantId }],
  } as AppealSummons

  const service = {
    id: serviceId,
    appealSummonsId: summonsId,
    defendantId,
    sentToServiceDate: new Date('2026-06-05T09:20:00.000Z'),
  } as AppealSummonsServiceRecipient

  let appealSummonsService: AppealSummonsService
  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockPoliceService: PoliceService
  let mockPdfService: PdfService
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction

  beforeEach(async () => {
    const module = await createTestingAppealSummonsModule()

    appealSummonsService = module.appealSummonsService
    mockAppealSummonsRepositoryService = module.appealSummonsRepositoryService
    mockPoliceService = module.policeService
    mockPdfService = module.pdfService
    mockCaseRepositoryService = module.caseRepositoryService
    transaction = {} as Transaction
    ;(
      mockAppealSummonsRepositoryService.findServiceRecipientById as jest.Mock
    ).mockResolvedValue(service)
  })

  it('calls CreateDocument with BRTNG_AFRYJUN and RECEIVER_TYPE', async () => {
    const externalPoliceDocumentId = uuid()
    const pdf = Buffer.from('appeal-summons-pdf')

    ;(mockPdfService.getAppealSummonsPdf as jest.Mock).mockResolvedValueOnce(
      pdf,
    )
    ;(
      mockCaseRepositoryService.findOriginalAncestorId as jest.Mock
    ).mockResolvedValueOnce(caseId)
    ;(mockPoliceService.createDocument as jest.Mock).mockResolvedValueOnce({
      externalPoliceDocumentId,
    })

    const result =
      await appealSummonsService.deliverAppealSummonsToNationalCommissionersOffice(
        {
          theCase,
          summons,
          service,
          user,
          transaction,
        },
      )

    expect(
      mockAppealSummonsRepositoryService.findServiceRecipientById,
    ).toHaveBeenCalledWith(serviceId, summonsId, {
      transaction,
      lock: true,
    })
    expect(mockPoliceService.createDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId,
        defendantId,
        fileTypeCode: PoliceFileTypeCode.APPEAL_SUMMONS,
        caseSupplements: expect.arrayContaining([
          {
            code: DocumentDeliverySupplementCode.RECEIVER_TYPE,
            value: DocumentDeliveryReceiverType.DEFENDANT,
          },
          { code: 'RVG_DOCUMENT_ID', value: serviceId },
          { code: 'RECEIVER_SSN', value: '0000000000' },
        ]),
      }),
    )
    expect(
      mockAppealSummonsRepositoryService.updateServiceRecipient,
    ).toHaveBeenCalledWith(
      serviceId,
      summonsId,
      { externalPoliceDocumentId },
      { transaction },
    )
    expect(result).toEqual({ delivered: true })
  })

  it('skips CreateDocument when the police document id is already set', async () => {
    const alreadyDelivered = {
      ...service,
      externalPoliceDocumentId: uuid(),
    } as AppealSummonsServiceRecipient
    ;(
      mockAppealSummonsRepositoryService.findServiceRecipientById as jest.Mock
    ).mockResolvedValueOnce(alreadyDelivered)

    const result =
      await appealSummonsService.deliverAppealSummonsToNationalCommissionersOffice(
        {
          theCase,
          summons,
          service: alreadyDelivered,
          user,
          transaction,
        },
      )

    expect(mockPoliceService.createDocument).not.toHaveBeenCalled()
    expect(result).toEqual({ delivered: true })
  })
})
