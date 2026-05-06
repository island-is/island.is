import { YesOrNoEnum } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { getIndexRateForConsumerIndexDate } from './rentalPeriodUtils'

describe('getIndexRateForConsumerIndexDate', () => {
  it('returns a string when consumer index values were stored as numbers', () => {
    const answers = {
      rentalAmount: {
        isIndexConnected: [YesOrNoEnum.YES],
        indexDate: '2026-06-01T00:00:00.000Z',
      },
    } as FormValue
    const externalData = {
      consumerIndex: {
        data: [{ month: '2026-06-01T00:00:00.000Z', value: 683.8 }],
      },
    } as unknown as ExternalData

    expect(getIndexRateForConsumerIndexDate(answers, externalData)).toBe(
      '683.8',
    )
  })
})
