import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingAppealVerdictModule } from './createTestingAppealVerdictModule'

import { AppealVerdict, AppealVerdictRepositoryService } from '../../repository'
import { AppealVerdictService } from '../appealVerdict.service'
import { PoliceUpdateAppealVerdictDto } from '../dto/policeUpdateAppealVerdict.dto'

describe('AppealVerdictService - Update police delivery', () => {
  const appealVerdictId = uuid()
  const transaction = {} as Transaction

  const appealVerdict = {
    id: appealVerdictId,
    externalPoliceDocumentId: 'police-document-id',
  } as AppealVerdict

  let mockAppealVerdictRepositoryService: AppealVerdictRepositoryService
  let appealVerdictService: AppealVerdictService

  beforeEach(async () => {
    const {
      appealVerdictRepositoryService,
      appealVerdictService: serviceUnderTest,
    } = await createTestingAppealVerdictModule()

    mockAppealVerdictRepositoryService = appealVerdictRepositoryService
    appealVerdictService = serviceUnderTest
  })

  it('persists mapped police delivery fields without inventing appealDate', async () => {
    const update: PoliceUpdateAppealVerdictDto = {
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate: new Date('2026-06-06T10:00:00.000Z'),
      servedBy: 'Lögreglumaður',
      comment: 'Athugasemd',
      deliveredToDefenderNationalId: '0000000000',
      appealDecision: VerdictAppealDecision.POSTPONE,
    }
    const updated = {
      ...appealVerdict,
      ...update,
    } as AppealVerdict

    const mockUpdate = mockAppealVerdictRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(updated)

    const result = await appealVerdictService.updatePoliceDelivery(
      appealVerdict,
      update,
      transaction,
    )

    expect(mockUpdate).toHaveBeenCalledWith(
      appealVerdictId,
      {
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate: update.serviceDate,
        servedBy: 'Lögreglumaður',
        comment: 'Athugasemd',
        deliveredToDefenderNationalId: '0000000000',
        appealDecision: VerdictAppealDecision.POSTPONE,
      },
      { transaction },
    )
    expect(mockUpdate.mock.calls[0][1]).not.toHaveProperty('appealDate')
    expect(result).toBe(updated)
  })
})
