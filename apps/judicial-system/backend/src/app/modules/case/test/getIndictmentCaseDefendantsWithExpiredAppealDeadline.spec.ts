import { subDays } from 'date-fns'
import { v4 as uuid } from 'uuid'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'

import {
  Case,
  CaseRepositoryService,
  Defendant,
  DefendantEventLog,
  Verdict,
} from '../../repository'
import { InternalCaseService } from '../internalCase.service'

describe('InternalCaseService - getIndictmentCaseDefendantsWithExpiredAppealDeadline', () => {
  let internalCaseService: InternalCaseService
  let mockCaseRepositoryService: CaseRepositoryService

  beforeEach(async () => {
    const { internalCaseService: service, caseRepositoryService } =
      await createTestingCaseModule()

    internalCaseService = service
    mockCaseRepositoryService = caseRepositoryService
  })

  const buildCase = ({
    defendantId,
    activeVerdictId,
    eventLogs,
  }: {
    defendantId: string
    activeVerdictId: string
    eventLogs: DefendantEventLog[]
  }): Case => {
    const serviceDate = subDays(new Date(), 30)

    return {
      id: uuid(),
      defendants: [
        {
          id: defendantId,
          verdicts: [
            {
              id: activeVerdictId,
              isActive: true,
              created: subDays(new Date(), 10),
              serviceDate,
            } as Verdict,
          ],
          eventLogs,
        } as Defendant,
      ],
    } as Case
  }

  it('includes a defendant when a certificate was delivered only for an older verdict', async () => {
    const defendantId = uuid()
    const activeVerdictId = uuid()
    const olderVerdictId = uuid()

    const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
    mockFindAll.mockResolvedValue([
      buildCase({
        defendantId,
        activeVerdictId,
        eventLogs: [
          {
            eventType:
              DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
            verdictId: olderVerdictId,
            created: subDays(new Date(), 20),
          } as DefendantEventLog,
        ],
      }),
    ])

    const result =
      await internalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline()

    expect(result).toEqual([
      expect.objectContaining({
        defendant: expect.objectContaining({ id: defendantId }),
      }),
    ])
  })

  it('excludes a defendant when a certificate was already delivered for the active verdict', async () => {
    const defendantId = uuid()
    const activeVerdictId = uuid()

    const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
    mockFindAll.mockResolvedValue([
      buildCase({
        defendantId,
        activeVerdictId,
        eventLogs: [
          {
            eventType:
              DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
            verdictId: activeVerdictId,
            created: subDays(new Date(), 5),
          } as DefendantEventLog,
        ],
      }),
    ])

    const result =
      await internalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline()

    expect(result).toEqual([])
  })
})
