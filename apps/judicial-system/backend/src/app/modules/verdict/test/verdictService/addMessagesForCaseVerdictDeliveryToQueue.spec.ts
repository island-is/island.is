import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import * as MessageModule from '@island.is/judicial-system/message'
import { MessageType } from '@island.is/judicial-system/message'
import {
  ServiceRequirement,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Case, Defendant, Verdict, VerdictRepositoryService } from '../../../repository'
import { VerdictService } from '../../verdict.service'

describe('VerdictService - addMessagesForCaseVerdictDeliveryToQueue', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const existingVerdictId = uuid()
  const transaction = {} as Transaction
  const user = { id: uuid() } as TUser

  let verdictService: VerdictService
  let mockVerdictRepositoryService: VerdictRepositoryService
  let mockAddMessagesToQueue: jest.Mock

  beforeEach(async () => {
    jest.resetAllMocks()

    const { verdictService: service, verdictRepositoryService } =
      await createTestingVerdictModule()

    verdictService = service
    mockVerdictRepositoryService = verdictRepositoryService
    mockAddMessagesToQueue = (
      jest.requireMock(
        '@island.is/judicial-system/message',
      ) as typeof MessageModule
    ).addMessagesToQueue as jest.Mock

    const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({} as Verdict)
    const mockCreate = mockVerdictRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue({ id: uuid() } as Verdict)
  })

  it('deactivates the existing verdict and creates a new active one when replacing a delivered verdict', async () => {
    const existingVerdict = {
      id: existingVerdictId,
      isActive: true,
      created: new Date('2026-01-01'),
      externalPoliceDocumentId: uuid(),
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceInformationForDefendant: [],
      isDefaultJudgement: false,
    } as Verdict

    const theCase = {
      id: caseId,
      defendants: [
        {
          id: defendantId,
          verdicts: [existingVerdict],
        } as Defendant,
      ],
    } as Case

    const result = await verdictService.addMessagesForCaseVerdictDeliveryToQueue(
      theCase,
      user,
      transaction,
    )

    expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      defendantId,
      existingVerdictId,
      { isActive: false },
      { transaction },
    )
    expect(mockVerdictRepositoryService.create).toHaveBeenCalledWith(
      {
        defendantId,
        caseId,
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceInformationForDefendant: [],
        isDefaultJudgement: false,
        isActive: true,
      },
      { transaction },
    )
    expect(mockAddMessagesToQueue).toHaveBeenCalledWith({
      type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
      user,
      caseId,
      elementId: [defendantId],
    })
    expect(result).toEqual({ queued: true })
  })

  it('does not replace a verdict that has not been delivered to police', async () => {
    const existingVerdict = {
      id: existingVerdictId,
      isActive: true,
      created: new Date('2026-01-01'),
      serviceRequirement: ServiceRequirement.REQUIRED,
    } as Verdict

    const theCase = {
      id: caseId,
      defendants: [
        {
          id: defendantId,
          verdicts: [existingVerdict],
        } as Defendant,
      ],
    } as Case

    await verdictService.addMessagesForCaseVerdictDeliveryToQueue(
      theCase,
      user,
      transaction,
    )

    expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    expect(mockVerdictRepositoryService.create).not.toHaveBeenCalled()
    expect(mockAddMessagesToQueue).toHaveBeenCalled()
  })
})
