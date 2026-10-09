import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  AppealEventType,
  HashAlgorithm,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { getCaseFileHash } from '../../../formatters'
import { PdfService } from '../../case'
import {
  AppealCase,
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'

describe('AppealSummonsController - Confirm', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const summonsId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    nationalId: '0000008888',
    name: 'Kamilla Haraldz',
    title: 'saksóknari',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const theCase = {
    id: caseId,
    verdictAppealCase: { id: appealCaseId } as AppealCase,
  } as Case

  const draft = {
    id: summonsId,
    caseId,
    confirmedDate: null,
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockPdfService: PdfService
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  beforeEach(async () => {
    const {
      sequelize,
      appealSummonsRepositoryService,
      appealEventLogRepositoryService,
      pdfService,
      appealSummonsController: controller,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockPdfService = pdfService
    appealSummonsController = controller

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => Promise<unknown>) => fn(transaction),
    )
  })

  it('confirms a draft, freezes the hash and logs the event', async () => {
    const pdf = Buffer.from('%PDF-confirmed')
    const { hash, hashAlgorithm } = getCaseFileHash(pdf)
    const confirmedDate = expect.any(Date)
    const afterConfirm = {
      id: summonsId,
      caseId,
      confirmedById: user.id,
      confirmedDate: new Date(),
      confirmedBy: user,
      defendants: [],
    } as AppealSummons
    const afterHash = {
      ...afterConfirm,
      hash,
      hashAlgorithm,
    } as AppealSummons

    ;(mockAppealSummonsRepositoryService.update as jest.Mock)
      .mockResolvedValueOnce(afterConfirm)
      .mockResolvedValueOnce(afterHash)
    ;(mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock)
      .mockResolvedValueOnce(afterConfirm)
      .mockResolvedValueOnce(afterHash)
    ;(mockPdfService.getAppealSummonsPdf as jest.Mock).mockResolvedValueOnce(
      pdf,
    )
    ;(
      mockAppealEventLogRepositoryService.create as jest.Mock
    ).mockResolvedValueOnce({})

    const result = await appealSummonsController.confirm(
      caseId,
      summonsId,
      theCase,
      draft,
      user,
    )

    expect(mockAppealSummonsRepositoryService.update).toHaveBeenNthCalledWith(
      1,
      summonsId,
      caseId,
      {
        confirmedById: user.id,
        confirmedDate,
      },
      { transaction },
    )
    expect(mockPdfService.getAppealSummonsPdf).toHaveBeenCalledWith(
      theCase,
      user,
      afterConfirm,
    )
    expect(mockAppealSummonsRepositoryService.update).toHaveBeenNthCalledWith(
      2,
      summonsId,
      caseId,
      { hash, hashAlgorithm: HashAlgorithm.SHA256 },
      { transaction },
    )
    expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        eventType: AppealEventType.APPEAL_SUMMONS_CONFIRMED,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )
    expect(result).toBe(afterHash)
  })

  it('rejects when the summons is already confirmed', async () => {
    await expect(
      appealSummonsController.confirm(
        caseId,
        summonsId,
        theCase,
        {
          ...draft,
          confirmedDate: new Date(),
        } as AppealSummons,
        user,
      ),
    ).rejects.toThrow(ForbiddenException)
  })

  it('rejects staff, who cannot confirm', async () => {
    const staff = {
      ...user,
      role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    } as User

    await expect(
      appealSummonsController.confirm(caseId, summonsId, theCase, draft, staff),
    ).rejects.toThrow(ForbiddenException)
  })

  it('rejects a district prosecutor', async () => {
    const districtProsecutor = {
      ...user,
      institution: { type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE },
    } as User

    await expect(
      appealSummonsController.confirm(
        caseId,
        summonsId,
        theCase,
        draft,
        districtProsecutor,
      ),
    ).rejects.toThrow(ForbiddenException)
  })
})
