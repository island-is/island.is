import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import {
  AppealSummonsRepositoryService,
  AppealSummonsServiceRecipient,
} from '../../repository'
import { AppealSummonsService } from '../appealSummons.service'
import { PoliceUpdateAppealSummonsServiceDto } from '../dto/policeUpdateAppealSummonsService.dto'

describe('AppealSummonsService - Update police delivery', () => {
  const summonsId = uuid()
  const serviceId = uuid()
  const transaction = {} as Transaction

  const service = {
    id: serviceId,
    appealSummonsId: summonsId,
    externalPoliceDocumentId: 'police-document-id',
  } as AppealSummonsServiceRecipient

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let appealSummonsService: AppealSummonsService

  beforeEach(async () => {
    const {
      appealSummonsRepositoryService,
      appealSummonsService: serviceUnderTest,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    appealSummonsService = serviceUnderTest
  })

  it('persists the mapped police delivery fields on the service row', async () => {
    const update: PoliceUpdateAppealSummonsServiceDto = {
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate: new Date('2026-06-06T10:00:00.000Z'),
      servedBy: 'Lögreglumaður',
      comment: 'Athugasemd',
    }
    const updated = {
      ...service,
      ...update,
    } as AppealSummonsServiceRecipient

    const mockUpdate =
      mockAppealSummonsRepositoryService.updateServiceRecipient as jest.Mock
    mockUpdate.mockResolvedValue(updated)

    const result = await appealSummonsService.updatePoliceDelivery(
      service,
      update,
      transaction,
    )

    expect(mockUpdate).toHaveBeenCalledWith(
      serviceId,
      summonsId,
      {
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate: update.serviceDate,
        servedBy: 'Lögreglumaður',
        comment: 'Athugasemd',
      },
      { transaction },
    )
    expect(result).toBe(updated)
  })
})
