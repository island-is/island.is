import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealEventType,
  AppealSummonsAppellantSide,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import {
  AppealEventLog,
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
  Defendant,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'
import { CreateAppealSummonsDto } from '../dto/createAppealSummons.dto'

interface Then {
  result: AppealSummons
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  dto: CreateAppealSummonsDto,
  user?: User,
) => Promise<Then>

describe('AppealSummonsController - Create', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const summonsId = uuid()
  const user = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '0000007777',
    name: 'Staff',
    title: 'skrifstofumaður',
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

  const caseWithAppeal = (appealEventLogs: AppealEventLog[]): Case =>
    ({
      id: caseId,
      defendants: [defendant],
      verdictAppealCase: { id: appealCaseId, appealEventLogs },
    } as Case)

  const theCase = caseWithAppeal([appealedLog])

  const dto: CreateAppealSummonsDto = {
    defendants: [
      {
        defendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Kröfur',
      },
    ],
  }

  const created = {
    id: summonsId,
    caseId,
    appealCaseId,
    defendants: [
      {
        defendantId,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Kröfur',
      },
    ],
  } as AppealSummons

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen
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

    ;(mockAppealSummonsRepositoryService.create as jest.Mock).mockResolvedValue(
      { id: summonsId },
    )
    ;(
      mockAppealSummonsRepositoryService.createDefendant as jest.Mock
    ).mockResolvedValue({})
    ;(
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    ).mockResolvedValue(created)
    ;(mockAppealEventLogRepositoryService.create as jest.Mock).mockResolvedValue(
      {},
    )

    givenWhenThen = async (theCase, dto, actingUser = user) => {
      const then = {} as Then

      try {
        then.result = await appealSummonsController.create(
          caseId,
          theCase,
          dto,
          actingUser,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('summons created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, dto)
    })

    it('creates the summons, defendant rows and an issued event', () => {
      expect(mockAppealSummonsRepositoryService.create).toHaveBeenCalledWith(
        { caseId, appealCaseId },
        { transaction },
      )
      expect(
        mockAppealSummonsRepositoryService.createDefendant,
      ).toHaveBeenCalledWith(
        {
          appealSummonsId: summonsId,
          defendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
        { transaction },
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_SUMMONS_ISSUED,
          userRole: user.role,
          userId: user.id,
        }),
        { transaction },
      )
      expect(then.result).toBe(created)
    })
  })

  it('rejects a case with no verdict appeal', async () => {
    const then = await givenWhenThen({ id: caseId } as Case, dto)

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(mockAppealSummonsRepositoryService.create).not.toHaveBeenCalled()
  })

  it('rejects a defendant with no standing appeal', async () => {
    const then = await givenWhenThen(caseWithAppeal([]), dto)

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toContain('no standing verdict appeal')
  })

  it('rejects a defendant who is not on the case', async () => {
    const unknownDefendantId = uuid()
    const then = await givenWhenThen(theCase, {
      defendants: [
        {
          defendantId: unknownDefendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
      ],
    })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toContain(
      `Defendant ${unknownDefendantId} is not on case ${caseId}`,
    )
    expect(mockAppealSummonsRepositoryService.create).not.toHaveBeenCalled()
  })

  it('uses the prosecution side when both sides stand, even if the client sends defence', async () => {
    const prosecutionLog = {
      id: uuid(),
      defendantId,
      eventType: AppealEventType.APPEALED,
      userRole: UserRole.PROSECUTOR,
      created: new Date(),
    } as AppealEventLog

    await givenWhenThen(
      caseWithAppeal([appealedLog, prosecutionLog]),
      {
        defendants: [
          {
            defendantId,
            appellantSide: AppealSummonsAppellantSide.DEFENCE,
            claims: 'Kröfur',
          },
        ],
      },
    )

    expect(
      mockAppealSummonsRepositoryService.createDefendant,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        appellantSide: AppealSummonsAppellantSide.PROSECUTION,
      }),
      { transaction },
    )
  })

  it('rejects a duplicate defendant', async () => {
    const then = await givenWhenThen(theCase, {
      defendants: [
        {
          defendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur',
        },
        {
          defendantId,
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Aðrar kröfur',
        },
      ],
    })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toContain('same defendant twice')
    expect(mockAppealSummonsRepositoryService.create).not.toHaveBeenCalled()
  })
})
