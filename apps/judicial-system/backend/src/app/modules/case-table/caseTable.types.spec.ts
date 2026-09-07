import { DefendantEventType } from '@island.is/judicial-system/types'

import { Case, Defendant } from '../repository'
import { expandCasesWithDefendants } from './caseTable.types'

const makeDefendant = (
  id: string,
  eventTypes: DefendantEventType[] = [],
): Defendant =>
  ({
    id,
    name: `Defendant ${id}`,
    eventLogs: eventTypes.map((eventType) => ({
      eventType,
      created: new Date('2020-09-16T19:50:08.033Z'),
    })),
  } as unknown as Defendant)

const makeCase = (defendants: Defendant[]): Case =>
  ({
    id: 'case-1',
    defendants,
    toJSON: () => ({ id: 'case-1' }),
  } as unknown as Case)

describe('expandCasesWithDefendants', () => {
  it('emits one row per defendant', () => {
    const rows = expandCasesWithDefendants([
      makeCase([makeDefendant('a'), makeDefendant('b')]),
    ])

    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.defendants?.[0].id)).toEqual(['a', 'b'])
  })

  it('skips defendants whose indictment was dismissed (completed for some)', () => {
    const rows = expandCasesWithDefendants([
      makeCase([
        makeDefendant('dismissed', [DefendantEventType.INDICTMENT_DISMISSED]),
        makeDefendant('active'),
      ]),
    ])

    expect(rows).toHaveLength(1)
    expect(rows[0].defendants?.[0].id).toBe('active')
  })

  it('skips defendants whose indictment was cancelled (completed for some)', () => {
    const rows = expandCasesWithDefendants([
      makeCase([
        makeDefendant('cancelled', [DefendantEventType.INDICTMENT_CANCELLED]),
        makeDefendant('active'),
      ]),
    ])

    expect(rows).toHaveLength(1)
    expect(rows[0].defendants?.[0].id).toBe('active')
  })

  it('emits no rows when every defendant was cancelled or dismissed', () => {
    const rows = expandCasesWithDefendants([
      makeCase([
        makeDefendant('dismissed', [DefendantEventType.INDICTMENT_DISMISSED]),
        makeDefendant('cancelled', [DefendantEventType.INDICTMENT_CANCELLED]),
      ]),
    ])

    expect(rows).toHaveLength(0)
  })
})
