import { CaseState } from '@island.is/judicial-system/types'
import { getDurationDate } from '@island.is/judicial-system-web/src/components/Table'

const date1 = '2022-08-04T19:50:08.033Z'
const date2 = '2022-09-04T19:30:08.033Z'
const date3 = '2022-09-13T19:50:07.033Z'
const date4 = '2022-12-24T18:00:00.033Z'

describe('getDurationDate', () => {
  test.each`
    state
    ${CaseState.REJECTED}
    ${CaseState.DISMISSED}
  `('should return null if state is REJECTED or DISMISSED', ({ state }) => {
    expect(getDurationDate(state, date1, date2, date4)).toBe(null)
  })

  test('should use initial ruling date if it is set', () => {
    const initialRulingDate = date1
    const validToDate = date2

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
    )

    expect(res).toBe('4.8.2022 - 4.9.2022')
  })

  test('should use ruling date if initialRulingDate is not set', () => {
    const initialRulingDate = undefined
    const rulingDate = date2
    const validToDate = date3

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBe('4.9.2022 - 13.9.2022')
  })

  test('should fallback to use validToDate', () => {
    const initialRulingDate = undefined
    const rulingDate = undefined
    const validToDate = date4

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBe('24.12.2022')
  })

  test('should return null if all dates are undefined', () => {
    const initialRulingDate = undefined
    const rulingDate = undefined
    const validToDate = undefined

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBeNull()
  })
})
