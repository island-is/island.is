import { FormValue } from '@island.is/application/types'
import { getMarketValueShare } from './getMarketValueShare'

describe('getMarketValueShare', () => {
  const answers: FormValue = {
    estate: {
      assets: [
        {
          marketValue: '20000000',
          share: 0,
          enabled: true,
        },
        {
          marketValue: '20000000',
          share: 50,
          enabled: true,
        },
        {
          marketValue: '20000000',
          share: 100,
          enabled: true,
        },
        {
          marketValue: '20000000',
          share: 75,
          enabled: true,
        },
        {
          marketValue: '20000000',
          share: 1,
          enabled: false,
        },
      ],
    },
  }

  const answersWithNoAsssets: FormValue = {
    estate: {
      assets: [],
    },
  }

  const answersWithDecimalShares: FormValue = {
    estate: {
      assets: [
        {
          marketValue: '10000000',
          share: 0.74,
          enabled: true,
        },
        {
          marketValue: '20000000',
          share: 50.5,
          enabled: true,
        },
      ],
    },
  }

  const answersWithSubOnePercentShare: FormValue = {
    estate: {
      assets: [
        {
          marketValue: '100000000',
          share: 0.5,
          enabled: true,
        },
      ],
    },
  }

  it('should return the correct sum in a currency format', () => {
    expect(getMarketValueShare(answers)).toEqual('45.000.000 kr.')
  })

  it('should return an empty string', () => {
    expect(getMarketValueShare(answersWithNoAsssets)).toEqual('')
  })

  it('should handle decimal share percentages', () => {
    // 10M * 0.74% = 74,000 + 20M * 50.5% = 10,100,000 = 10,174,000
    expect(getMarketValueShare(answersWithDecimalShares)).toEqual(
      '10.174.000 kr.',
    )
  })

  it('should handle share percentages below 1%', () => {
    // 100M * 0.5% = 500,000
    expect(getMarketValueShare(answersWithSubOnePercentShare)).toEqual(
      '500.000 kr.',
    )
  })

  it('should round fractional results from decimal shares', () => {
    // 123,123 * 0.03% = 36.9369 → rounds to 37
    const answersWithFractionalResult: FormValue = {
      estate: {
        assets: [
          {
            marketValue: '123123',
            share: 0.03,
            enabled: true,
          },
        ],
      },
    }
    expect(getMarketValueShare(answersWithFractionalResult)).toEqual('37 kr.')
  })
})
