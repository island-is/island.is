import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
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

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
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
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  // The route is guarded by CaseExistsForUpdateGuard, so the request
  // transaction is already open - and holding a lock on this case row - by
  // the time the handler runs. Guards do not execute in controller unit
  // tests, so the request context and that transaction are set up here
  // instead.
  const update = (
    summons: AppealSummons,
    caseToUpdate: Case = theCase,
    updateDto: CreateAppealSummonsDto = dto,
  ) =>
    runInRequestContext(async () => {
      await getOrCreateTransaction(mockSequelize)

      return appealSummonsController.update(
        caseId,
        summonsId,
        caseToUpdate,
        summons,
        updateDto,
        user,
      )
    })

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
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {
      afterCommit: jest.fn((callback: () => void) => {
        void callback()
      }),
    } as unknown as Transaction
    mockTransaction.mockResolvedValue(transaction)
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

  it('replaces defendant rows in the transaction the guard opened and does not write an issued event', async () => {
    const summons = { id: summonsId } as AppealSummons

    const result = await update(summons)

    // Once, by the stand-in for CaseExistsForUpdateGuard above. A second call
    // would be the handler opening a transaction of its own, which would
    // block on the guard's row lock and deadlock the request.
    expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
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

    await update(summons)

    expect(mockAppealSummonsRepositoryService.update).toHaveBeenCalledWith(
      summonsId,
      caseId,
      {
        confirmedById: null,
        confirmedDate: null,
        hash: null,
        hashAlgorithm: null,
      },
      { transaction, where: { sentToCourtOfAppealsDate: null } },
    )
    expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(
      theCase.type,
      `${caseId}/appealSummons/${summonsId}.pdf`,
    )
  })

  it('does not delete the cached PDF when a confirmation landed before cleanup', async () => {
    const summons = {
      id: summonsId,
      confirmedDate: new Date(),
      confirmedById: uuid(),
      hash: 'abc',
    } as AppealSummons
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValue({
      ...updated,
      hash: 'reconfirmed-hash',
    } as AppealSummons)

    await update(summons)

    expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
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

    await update(summons, caseWithWithdrawn, dtoWithWithdrawn)

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

    await expect(update(summons)).rejects.toBeInstanceOf(ForbiddenException)

    expect(
      mockAppealSummonsRepositoryService.deleteDefendants,
    ).not.toHaveBeenCalled()
  })

  it('rejects an edit once the summons has been sent for service', async () => {
    const summons = {
      id: summonsId,
      services: [{ id: uuid() }],
    } as unknown as AppealSummons

    await expect(update(summons)).rejects.toBeInstanceOf(ForbiddenException)

    expect(
      mockAppealSummonsRepositoryService.deleteDefendants,
    ).not.toHaveBeenCalled()
  })
})
