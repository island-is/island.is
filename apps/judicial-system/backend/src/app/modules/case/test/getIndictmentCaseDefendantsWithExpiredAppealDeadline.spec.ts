import subDays from 'date-fns/subDays'
import { v4 as uuid } from 'uuid'

import {
  DefendantEventType,
  ServiceRequirement,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

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
    verdicts,
    eventLogs,
  }: {
    defendantId: string
    verdicts: Verdict[]
    eventLogs: DefendantEventLog[]
  }): Case => {
    return {
      id: uuid(),
      defendants: [
        {
          id: defendantId,
          verdicts,
          eventLogs,
        } as Defendant,
      ],
    } as Case
  }

  const eligibleVerdict = (
    id: string,
    created: Date,
    serviceDate: Date,
  ): Verdict =>
    ({
      id,
      created,
      serviceDate,
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
    } as Verdict)

  it('includes a defendant when a certificate was delivered only for an older verdict', async () => {
    const defendantId = uuid()
    const latestVerdictId = uuid()
    const olderVerdictId = uuid()

    const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
    mockFindAll.mockResolvedValue([
      buildCase({
        defendantId,
        verdicts: [
          eligibleVerdict(
            latestVerdictId,
            subDays(new Date(), 10),
            subDays(new Date(), 30),
          ),
        ],
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

  it('excludes a defendant when a certificate was already delivered for the latest verdict', async () => {
    const defendantId = uuid()
    const latestVerdictId = uuid()

    const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
    mockFindAll.mockResolvedValue([
      buildCase({
        defendantId,
        verdicts: [
          eligibleVerdict(
            latestVerdictId,
            subDays(new Date(), 10),
            subDays(new Date(), 30),
          ),
        ],
        eventLogs: [
          {
            eventType:
              DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
            verdictId: latestVerdictId,
            created: subDays(new Date(), 5),
          } as DefendantEventLog,
        ],
      }),
    ])

    const result =
      await internalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline()

    expect(result).toEqual([])
  })

  it('excludes a defendant when only an older verdict is past the appeal deadline', async () => {
    const defendantId = uuid()
    const olderVerdictId = uuid()
    const newerVerdictId = uuid()

    const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
    mockFindAll.mockResolvedValue([
      buildCase({
        defendantId,
        // Unordered on purpose: selection must use newest by created,
        // not the first matching expired row.
        verdicts: [
          eligibleVerdict(
            olderVerdictId,
            subDays(new Date(), 40),
            subDays(new Date(), 35),
          ),
          eligibleVerdict(
            newerVerdictId,
            subDays(new Date(), 5),
            subDays(new Date(), 3),
          ),
        ],
        eventLogs: [],
      }),
    ])

    const result =
      await internalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline()

    expect(result).toEqual([])
  })
})
