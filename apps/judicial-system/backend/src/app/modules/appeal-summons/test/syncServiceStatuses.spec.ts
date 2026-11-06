import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  InstitutionType,
  User,
  UserRole,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingAppealSummonsModule } from './createTestingAppealSummonsModule'

import { PoliceService } from '../../police'
import {
  AppealCase,
  AppealSummons,
  AppealSummonsRepositoryService,
  AppealSummonsServiceRecipient,
  Case,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'

describe('AppealSummonsController - Sync service statuses', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const serviceId = uuid()
  const policeDocumentId = 'police-document-id'
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

  const waitingService = {
    id: serviceId,
    appealSummonsId: summonsId,
    defendantId: uuid(),
    sentToServiceDate: new Date('2026-06-05T09:20:00.000Z'),
    externalPoliceDocumentId: policeDocumentId,
  } as AppealSummonsServiceRecipient

  const summons = {
    id: summonsId,
    caseId,
    services: [waitingService],
  } as AppealSummons

  const theCase = {
    id: caseId,
    verdictAppealCase: {
      id: uuid(),
      appealSummonses: [summons],
    } as AppealCase,
  } as Case

  let mockAppealSummonsRepositoryService: AppealSummonsRepositoryService
  let mockPoliceService: PoliceService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealSummonsController: AppealSummonsController

  beforeEach(async () => {
    const {
      appealSummonsRepositoryService,
      policeService,
      sequelize,
      appealSummonsController: controller,
    } = await createTestingAppealSummonsModule()

    mockAppealSummonsRepositoryService = appealSummonsRepositoryService
    mockPoliceService = policeService
    mockSequelize = sequelize
    appealSummonsController = controller

    transaction = {} as Transaction
    const mockTransaction = mockSequelize.transaction as jest.Mock
    mockTransaction.mockImplementation(
      async (callback: (transaction: Transaction) => Promise<unknown>) =>
        callback(transaction),
    )
  })

  it('updates waiting service rows when LOKE reports a change', async () => {
    const serviceDate = new Date('2026-06-06T10:00:00.000Z')
    const updatedService = {
      ...waitingService,
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate,
      servedBy: 'Lögreglumaður',
    } as AppealSummonsServiceRecipient

    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock
    mockGetStatus.mockResolvedValue({
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate,
      servedBy: 'Lögreglumaður',
    })

    const reloadedSummons = {
      ...summons,
      services: [updatedService],
    } as AppealSummons

    const mockUpdate =
      mockAppealSummonsRepositoryService.updateServiceRecipient as jest.Mock
    mockUpdate.mockResolvedValue(updatedService)

    const mockFind =
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    mockFind.mockResolvedValue(reloadedSummons)

    const result = await appealSummonsController.syncServiceStatuses(
      caseId,
      theCase,
      user,
    )

    expect(mockGetStatus).toHaveBeenCalledWith(policeDocumentId, user)
    expect(mockUpdate).toHaveBeenCalledWith(
      serviceId,
      summonsId,
      {
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate,
        servedBy: 'Lögreglumaður',
        comment: undefined,
      },
      { transaction },
    )
    expect(mockFind).toHaveBeenCalledWith(summonsId, caseId, { transaction })
    expect(result).toEqual([reloadedSummons])
  })

  it('skips rows that already have a service status', async () => {
    const servedCase = {
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealSummonses: [
          {
            ...summons,
            services: [
              {
                ...waitingService,
                serviceStatus: VerdictServiceStatus.IN_PERSON,
                serviceDate: new Date('2026-06-06T10:00:00.000Z'),
              },
            ],
          },
        ],
      },
    } as Case

    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock

    const result = await appealSummonsController.syncServiceStatuses(
      caseId,
      servedCase,
      user,
    )

    expect(mockGetStatus).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('returns an empty list when LOKE has nothing new', async () => {
    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock
    mockGetStatus.mockResolvedValue({})

    const mockUpdate =
      mockAppealSummonsRepositoryService.updateServiceRecipient as jest.Mock

    const result = await appealSummonsController.syncServiceStatuses(
      caseId,
      theCase,
      user,
    )

    expect(mockGetStatus).toHaveBeenCalledWith(policeDocumentId, user)
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('continues syncing other rows when one LOKE lookup fails', async () => {
    const otherServiceId = uuid()
    const otherPoliceDocumentId = 'other-police-document-id'
    const otherService = {
      id: otherServiceId,
      appealSummonsId: summonsId,
      defendantId: uuid(),
      sentToServiceDate: new Date('2026-06-05T09:20:00.000Z'),
      externalPoliceDocumentId: otherPoliceDocumentId,
    } as AppealSummonsServiceRecipient
    const multiServiceCase = {
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealSummonses: [
          {
            ...summons,
            services: [waitingService, otherService],
          },
        ],
      },
    } as Case

    const serviceDate = new Date('2026-06-06T10:00:00.000Z')
    const updatedService = {
      ...otherService,
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate,
      servedBy: 'Lögreglumaður',
    } as AppealSummonsServiceRecipient

    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock
    mockGetStatus
      .mockRejectedValueOnce(new Error('LOKE unavailable'))
      .mockResolvedValueOnce({
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate,
        servedBy: 'Lögreglumaður',
      })

    const reloadedSummons = {
      ...summons,
      services: [waitingService, updatedService],
    } as AppealSummons

    const mockUpdate =
      mockAppealSummonsRepositoryService.updateServiceRecipient as jest.Mock
    mockUpdate.mockResolvedValue(updatedService)

    const mockFind =
      mockAppealSummonsRepositoryService.findByIdAndCaseId as jest.Mock
    mockFind.mockResolvedValue(reloadedSummons)

    const result = await appealSummonsController.syncServiceStatuses(
      caseId,
      multiServiceCase,
      user,
    )

    expect(mockGetStatus).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledWith(summonsId, caseId, { transaction })
    expect(result).toEqual([reloadedSummons])
  })
})
