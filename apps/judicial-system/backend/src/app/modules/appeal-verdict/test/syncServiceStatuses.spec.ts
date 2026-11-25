import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  InstitutionType,
  User,
  UserRole,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingAppealVerdictModule } from './createTestingAppealVerdictModule'

import { runInRequestContext } from '../../../test'
import { PoliceService } from '../../police'
import {
  AppealVerdict,
  AppealVerdictRepositoryService,
  Case,
} from '../../repository'
import { AppealVerdictController } from '../appealVerdict.controller'

describe('AppealVerdictController - Sync service statuses', () => {
  const caseId = uuid()
  const appealVerdictId = uuid()
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

  const waiting = {
    id: appealVerdictId,
    caseId,
    defendantId: uuid(),
    sentToServiceDate: new Date('2026-06-05T09:20:00.000Z'),
    externalPoliceDocumentId: policeDocumentId,
  } as AppealVerdict

  const theCase = { id: caseId } as Case

  let mockAppealVerdictRepositoryService: AppealVerdictRepositoryService
  let mockPoliceService: PoliceService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let appealVerdictController: AppealVerdictController

  const syncServiceStatuses = (caseToSync: Case) =>
    runInRequestContext(() =>
      appealVerdictController.syncServiceStatuses(caseId, caseToSync, user),
    )

  beforeEach(async () => {
    const {
      appealVerdictRepositoryService,
      policeService,
      sequelize,
      appealVerdictController: controller,
    } = await createTestingAppealVerdictModule()

    mockAppealVerdictRepositoryService = appealVerdictRepositoryService
    mockPoliceService = policeService
    mockSequelize = sequelize
    appealVerdictController = controller

    transaction = {} as Transaction
    const mockTransaction = mockSequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)
    ;(
      mockAppealVerdictRepositoryService.findByCaseId as jest.Mock
    ).mockResolvedValue([waiting])
  })

  it('updates waiting rows when LOKE reports a change', async () => {
    const serviceDate = new Date('2026-06-06T10:00:00.000Z')
    const updated = {
      ...waiting,
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate,
      servedBy: 'Lögreglumaður',
    } as AppealVerdict

    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock
    mockGetStatus.mockResolvedValue({
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate,
      servedBy: 'Lögreglumaður',
      defenderNationalId: '0000000000',
    })

    const mockRecord =
      mockAppealVerdictRepositoryService.recordServiceStatusIfUnset as jest.Mock
    mockRecord.mockResolvedValue(updated)

    const result = await syncServiceStatuses(theCase)

    expect(mockGetStatus).toHaveBeenCalledWith(policeDocumentId, user)
    expect(mockRecord).toHaveBeenCalledWith(
      appealVerdictId,
      {
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate,
        servedBy: 'Lögreglumaður',
        comment: undefined,
        deliveredToDefenderNationalId: '0000000000',
      },
      { transaction },
    )
    expect(result).toEqual([updated])
  })

  it('skips a poll update when the row was served during the LOKE round-trip', async () => {
    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock
    mockGetStatus.mockResolvedValue({
      serviceStatus: VerdictServiceStatus.IN_PERSON,
      serviceDate: new Date('2026-06-06T10:00:00.000Z'),
      servedBy: 'Lögreglumaður',
    })

    const mockRecord =
      mockAppealVerdictRepositoryService.recordServiceStatusIfUnset as jest.Mock
    mockRecord.mockResolvedValue(null)

    const result = await syncServiceStatuses(theCase)

    expect(mockRecord).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('skips rows that already have a service status', async () => {
    ;(
      mockAppealVerdictRepositoryService.findByCaseId as jest.Mock
    ).mockResolvedValue([
      {
        ...waiting,
        serviceStatus: VerdictServiceStatus.IN_PERSON,
        serviceDate: new Date('2026-06-06T10:00:00.000Z'),
      } as AppealVerdict,
    ])

    const mockGetStatus =
      mockPoliceService.getVerdictDocumentStatus as jest.Mock

    const result = await syncServiceStatuses(theCase)

    expect(mockGetStatus).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })
})
