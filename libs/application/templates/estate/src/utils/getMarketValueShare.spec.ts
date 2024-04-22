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

  it('should return the correct sum in a currency format', () => {
    expect(getMarketValueShare(answers)).toEqual('45.000.000 kr.')
  })

  it('should return an empty string', () => {
    expect(getMarketValueShare(answersWithNoAsssets)).toEqual('')
  })
})
