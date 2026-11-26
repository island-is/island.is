import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealEventType,
  CaseFileCategory,
  InstitutionType,
  ServiceRequirement,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealVerdictModule } from './createTestingAppealVerdictModule'

import {
  getOrCreateTransaction,
  queueMessagesAfterCommit,
} from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  AppealVerdict,
  AppealVerdictRepositoryService,
  Case,
} from '../../repository'
import { AppealVerdictController } from '../appealVerdict.controller'

jest.mock('../../../middleware/queueMessagesAfterCommit')

describe('AppealVerdictController - Send to service', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const appealVerdictId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '0000009999',
    name: 'Skrifstofa',
    title: 'fulltrúi',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId, nationalId: '0000000000' }],
    caseFiles: [
      {
        name: 'Dómur Landsréttar',
        category: CaseFileCategory.VERDICT_APPEAL_RULING,
      },
    ],
    verdictAppealCase: {
      id: appealCaseId,
      appealCaseNumber: 'L-1/2026',
      appealState: AppealCaseState.COMPLETED,
      appealEventLogs: [
        {
          defendantId,
          eventType: AppealEventType.APPEALED,
          created: new Date('2026-01-01'),
          userRole: UserRole.DEFENDER,
        },
      ],
    },
  } as Case

  let mockAppealVerdictRepositoryService: AppealVerdictRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealVerdictController: AppealVerdictController

  const sendToService = (
    caseToSend: Case,
    defendantIds: string[],
    actingUser: User = user,
  ) =>
    runInRequestContext(async () => {
      await getOrCreateTransaction(mockSequelize)

      return appealVerdictController.sendToService(
        caseId,
        caseToSend,
        actingUser,
        { defendantIds },
      )
    })

  beforeEach(async () => {
    const {
      sequelize,
      appealVerdictRepositoryService,
      appealVerdictController: controller,
    } = await createTestingAppealVerdictModule()

    mockAppealVerdictRepositoryService = appealVerdictRepositoryService
    appealVerdictController = controller
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)
    ;(queueMessagesAfterCommit as jest.Mock).mockClear()
  })

  it('creates an appeal verdict row and queues CreateDocument delivery', async () => {
    const created = {
      id: appealVerdictId,
      caseId,
      appealCaseId,
      defendantId,
      serviceRequirement: ServiceRequirement.REQUIRED,
      sentToServiceDate: expect.any(Date),
    } as AppealVerdict

    ;(
      mockAppealVerdictRepositoryService.findByDefendantId as jest.Mock
    ).mockResolvedValue(null)
    ;(mockAppealVerdictRepositoryService.create as jest.Mock).mockResolvedValue(
      created,
    )

    const result = await sendToService(theCase, [defendantId])

    expect(mockAppealVerdictRepositoryService.create).toHaveBeenCalledWith(
      {
        caseId,
        appealCaseId,
        defendantId,
        serviceRequirement: ServiceRequirement.REQUIRED,
        sentToServiceDate: expect.any(Date),
      },
      { transaction },
    )
    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT,
      user,
      caseId,
      elementId: appealVerdictId,
    })
    expect(result).toEqual([created])
  })

  it('rejects when the appeal verdict was already delivered to police', async () => {
    ;(
      mockAppealVerdictRepositoryService.findByDefendantId as jest.Mock
    ).mockResolvedValue({
      id: appealVerdictId,
      defendantId,
      sentToServiceDate: new Date('2026-06-01'),
      externalPoliceDocumentId: uuid(),
    } as AppealVerdict)

    await expect(sendToService(theCase, [defendantId])).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('re-queues delivery when a prior send never received an external police id', async () => {
    const existing = {
      id: appealVerdictId,
      caseId,
      appealCaseId,
      defendantId,
      sentToServiceDate: new Date('2026-06-01'),
    } as AppealVerdict
    const updated = {
      ...existing,
      sentToServiceDate: new Date('2026-06-10'),
    } as AppealVerdict

    ;(
      mockAppealVerdictRepositoryService.findByDefendantId as jest.Mock
    ).mockResolvedValue(existing)
    ;(mockAppealVerdictRepositoryService.update as jest.Mock).mockResolvedValue(
      updated,
    )

    const result = await sendToService(theCase, [defendantId])

    expect(mockAppealVerdictRepositoryService.update).toHaveBeenCalledWith(
      appealVerdictId,
      {
        serviceRequirement: ServiceRequirement.REQUIRED,
        sentToServiceDate: expect.any(Date),
      },
      { transaction },
    )
    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT,
      user,
      caseId,
      elementId: appealVerdictId,
    })
    expect(result).toEqual([updated])
  })

  it('rejects when the COA ruling file is missing', async () => {
    const caseWithoutRuling = {
      ...theCase,
      caseFiles: [],
    } as Case

    await expect(
      sendToService(caseWithoutRuling, [defendantId]),
    ).rejects.toBeInstanceOf(NotFoundException)
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when the case has no verdict appeal case', async () => {
    const caseWithoutAppeal = {
      ...theCase,
      verdictAppealCase: undefined,
    } as Case

    await expect(
      sendToService(caseWithoutAppeal, [defendantId]),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when the verdict appeal is not completed', async () => {
    const caseWithOpenAppeal = {
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealState: AppealCaseState.RECEIVED,
      },
    } as Case

    await expect(
      sendToService(caseWithOpenAppeal, [defendantId]),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when the defendant is not on the case', async () => {
    await expect(sendToService(theCase, [uuid()])).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when the defendant is on the case but not a party to the appeal', async () => {
    const coDefendantId = uuid()
    const caseWithCoDefendant = {
      ...theCase,
      defendants: [
        ...(theCase.defendants ?? []),
        { id: coDefendantId, nationalId: '1111111111' },
      ],
    } as Case

    await expect(
      sendToService(caseWithCoDefendant, [coDefendantId]),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('rejects when the defendant has no national id', async () => {
    const caseWithoutNationalId = {
      ...theCase,
      defendants: [{ id: defendantId, noNationalId: true }],
    } as Case

    await expect(
      sendToService(caseWithoutNationalId, [defendantId]),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })
})
