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

import { AwsS3Service } from '../../aws-s3'
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
        claims: 'Uppfærðar kröfur',
      },
    ],
  }

  const updated = {
    id: summonsId,
    defendants: [
      {
        defendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Uppfærðar kröfur',
      },
    ],
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockAwsS3Service: AwsS3Service
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  beforeEach(async () => {
    const {
      sequelize,
      appealSummonsRepositoryService,
      appealEventLogRepositoryService,
      awsS3Service,
      appealSummonsController: controller,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockAwsS3Service = awsS3Service
    appealSummonsController = controller

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {
      afterCommit: jest.fn((callback: () => void) => {
        void callback()
      }),
    } as unknown as Transaction
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
    ;(mockAppealSummonsRepositoryService.update as jest.Mock).mockResolvedValue(
      [1],
    )
    ;(mockAwsS3Service.deleteObject as jest.Mock).mockResolvedValue(true)
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

  it('clears confirmation and the cached PDF when a confirmed summons is edited', async () => {
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
    expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(
      theCase.type,
      `${caseId}/appealSummons/${summonsId}.pdf`,
    )
  })

  it('keeps a defendant already on the summons after their appeal is withdrawn', async () => {
    const withdrawnDefendantId = uuid()
    const caseWithWithdrawn = {
      ...theCase,
      defendants: [
        defendant,
        { id: withdrawnDefendantId, name: 'Withdrawn' } as Defendant,
      ],
    } as Case
    const summons = {
      id: summonsId,
      defendants: [
        {
          defendantId: withdrawnDefendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Old claims',
        },
      ],
    } as AppealSummons
    const dtoWithWithdrawn: CreateAppealSummonsDto = {
      defendants: [
        {
          defendantId: withdrawnDefendantId,
          claims: 'Kept after withdraw',
        },
      ],
    }

    await appealSummonsController.update(
      caseId,
      summonsId,
      caseWithWithdrawn,
      summons,
      dtoWithWithdrawn,
      user,
    )

    expect(
      mockAppealSummonsRepositoryService.createDefendant,
    ).toHaveBeenCalledWith(
      {
        appealSummonsId: summonsId,
        defendantId: withdrawnDefendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Kept after withdraw',
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
