import { YesOrNoEnum } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  getConsumerIndexDateOptions,
  getIndexRateForConsumerIndexDate,
} from './rentalPeriodUtils'

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

describe('getConsumerIndexDateOptions', () => {
  const buildApplication = (startDate: string, months: string[]): Application =>
    ({
      answers: { rentalPeriod: { startDate } },
      externalData: {
        consumerIndex: {
          data: months.map((month) => ({ month, value: '100' })),
        },
      },
    } as unknown as Application)

  it('excludes index months before the contract start month', () => {
    const application = buildApplication('2023-02-15', [
      '2023-01-01T00:00:00.000Z',
      '2023-02-01T00:00:00.000Z',
      '2023-03-01T00:00:00.000Z',
    ])

    const options = getConsumerIndexDateOptions(application)

    expect(options.map((o) => o.value)).toEqual([
      '2023-03-01T00:00:00.000Z',
      '2023-02-01T00:00:00.000Z',
    ])
  })

  it('sorts newest first, so the oldest remaining option is last', () => {
    const application = buildApplication('2023-01-01', [
      '2023-01-01T00:00:00.000Z',
      '2023-02-01T00:00:00.000Z',
      '2023-03-01T00:00:00.000Z',
    ])

    const options = getConsumerIndexDateOptions(application)

    expect(options[options.length - 1].value).toBe('2023-01-01T00:00:00.000Z')
  })
})
