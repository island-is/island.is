import { createTestIntl } from '@island.is/cms-translations/test'

import { courtRecord } from '../messages'
import { formatCourtEndDate } from './courtRecordPdf'

describe('formatCourtEndDate', () => {
  const formatMessage = createTestIntl({
    locale: 'is-IS',
    onError: jest.fn,
  }).formatMessage

  function fn(startDate?: Date, endDate?: Date) {
    return formatCourtEndDate(formatMessage, startDate, endDate)
  }

  test('should return court still in progress', () => {
    const startDate = undefined
    const endDate = undefined

    const result = fn(startDate, endDate)
    expect(result).toBe(courtRecord.inSession.defaultMessage)
  })

  test('should format court end date when ending on same day as starting', () => {
    const startDate = new Date('2020-01-01 10:00:00')
    const endDate = new Date('2020-01-01 11:00:00')

    const result = fn(startDate, endDate)
    expect(result).toBe('Þinghaldi lýkur kl. 11:00.')
  })

  test('should format court end date when ending on different day', () => {
    const startDate = new Date('2020-01-01 10:00:00')
    const endDate = new Date('2020-01-02 11:00:00')

    const result = fn(startDate, endDate)
    expect(result).toBe('Þinghaldi lýkur 2. janúar kl. 11:00.')
  })
})
