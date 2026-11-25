import { DefendantEventType } from '@island.is/judicial-system/types'

import { DefendantEventLog, Verdict } from '../repository'
import { wasVerdictServiceCertificateDeliveredToPolice } from '../verdictServiceCertificateDelivery'

describe('wasVerdictServiceCertificateDeliveredToPolice', () => {
  const verdict = {
    id: 'verdict-2',
    created: new Date('2026-06-01'),
  } as Pick<Verdict, 'id' | 'created'>

  it('returns false when there are no event logs', () => {
    expect(
      wasVerdictServiceCertificateDeliveredToPolice(undefined, verdict),
    ).toBe(false)
  })

  it('returns true when an event exists for the verdict id', () => {
    const eventLogs = [
      {
        eventType:
          DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
        verdictId: 'verdict-2',
        created: new Date('2026-07-01'),
      },
    ] as DefendantEventLog[]

    expect(
      wasVerdictServiceCertificateDeliveredToPolice(eventLogs, verdict),
    ).toBe(true)
  })

  it('returns false when events exist only for another verdict', () => {
    const eventLogs = [
      {
        eventType:
          DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
        verdictId: 'verdict-1',
        created: new Date('2026-05-01'),
      },
    ] as DefendantEventLog[]

    expect(
      wasVerdictServiceCertificateDeliveredToPolice(eventLogs, verdict),
    ).toBe(false)
  })

  it('treats a null verdictId event as delivered when the verdict predates it', () => {
    const eventLogs = [
      {
        eventType:
          DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
        verdictId: null,
        created: new Date('2026-07-01'),
      },
    ] as unknown as DefendantEventLog[]

    expect(
      wasVerdictServiceCertificateDeliveredToPolice(eventLogs, verdict),
    ).toBe(true)
  })

  it('does not treat a null verdictId event as delivered for a later replacement verdict', () => {
    const eventLogs = [
      {
        eventType:
          DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
        verdictId: null,
        created: new Date('2026-05-01'),
      },
    ] as unknown as DefendantEventLog[]

    expect(
      wasVerdictServiceCertificateDeliveredToPolice(eventLogs, verdict),
    ).toBe(false)
  })
})
