import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  AppealEventType,
  AppealSummonsAppellantSide,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import {
  AppealCase,
  AppealEventLog,
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
  Defendant,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'
import { CreateAppealSummonsDto } from '../dto/createAppealSummons.dto'

describe('AppealSummonsController - Update', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const summonsId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '0000007777',
    name: 'Staff',
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as User

  const defendant = { id: defendantId, name: 'Jón Jónsson' } as Defendant
  const appealedLog = {
    id: uuid(),
    defendantId,
    eventType: AppealEventType.APPEALED,
    userRole: UserRole.DEFENDER,
    created: new Date(),
  } as AppealEventLog

  const theCase = {
    id: caseId,
    defendants: [defendant],
    verdictAppealCase: {
      id: appealCaseId,
      appealEventLogs: [appealedLog],
    } as AppealCase,
  } as Case

  const dto: CreateAppealSummonsDto = {
    defendants: [
      {
        defendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Uppfærðar kröfur',
      },
    ],
  }

  const updated = {
    id: summonsId,
    defendants: dto.defendants,
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  beforeEach(async () => {
    const {
      sequelize,
      appealSummonsRepositoryService,
      appealEventLogRepositoryService,
      appealSummonsController: controller,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    appealSummonsController = controller

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => Promise<unknown>) => fn(transaction),
    )
    ;(
      mockAppealSummonsRepositoryService.deleteDefendants as jest.Mock
    ).mockResolvedValue(1)
    ;(
      mockAppealSummonsRepositoryService.createDefendant as jest.Mock
    ).mockResolvedValue({})
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValue(updated)
  })

  it('replaces defendant rows and does not write an issued event', async () => {
    const summons = { id: summonsId } as AppealSummons

    const result = await appealSummonsController.update(
      caseId,
      summonsId,
      theCase,
      summons,
      dto,
      user,
    )

    expect(
      mockAppealSummonsRepositoryService.deleteDefendants,
    ).toHaveBeenCalledWith(summonsId, { transaction })
    expect(
      mockAppealSummonsRepositoryService.createDefendant,
    ).toHaveBeenCalledWith(
      {
        appealSummonsId: summonsId,
        defendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Uppfærðar kröfur',
      },
      { transaction },
    )
    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    expect(result).toBe(updated)
  })

  it('clears confirmation when a confirmed summons is edited', async () => {
    const summons = {
      id: summonsId,
      confirmedDate: new Date(),
      confirmedById: uuid(),
      hash: 'abc',
    } as AppealSummons

    await appealSummonsController.update(
      caseId,
      summonsId,
      theCase,
      summons,
      dto,
      user,
    )

    expect(mockAppealSummonsRepositoryService.update).toHaveBeenCalledWith(
      summonsId,
      caseId,
      {
        confirmedById: null,
        confirmedDate: null,
        hash: null,
        hashAlgorithm: null,
      },
      { transaction },
    )
  })

  it('rejects an edit after the summons has been sent to the Court of Appeals', async () => {
    const summons = {
      id: summonsId,
      sentToCourtOfAppealsDate: new Date(),
    } as AppealSummons

    await expect(
      appealSummonsController.update(
        caseId,
        summonsId,
        theCase,
        summons,
        dto,
        user,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException)

    expect(
      mockAppealSummonsRepositoryService.deleteDefendants,
    ).not.toHaveBeenCalled()
  })

  it('rejects an edit once the summons has been sent for service', async () => {
    const summons = {
      id: summonsId,
      services: [{ id: uuid() }],
    } as unknown as AppealSummons

    await expect(
      appealSummonsController.update(
        caseId,
        summonsId,
        theCase,
        summons,
        dto,
        user,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException)

    expect(
      mockAppealSummonsRepositoryService.deleteDefendants,
    ).not.toHaveBeenCalled()
  })
})
