import { FormValue } from '@island.is/application/types'
import { getMarketValueShare } from './getMarketValueShare'

describe('getMarketValueShare', () => {
  const answers: FormValue = {
    estate: {
      assets: [
        {
          marketValue: '20000000',
          share: 0,
        },
        {
          marketValue: '20000000',
          share: 50,
        },
        {
          marketValue: '20000000',
          share: 100,
        },
        {
          marketValue: '20000000',
          share: 75,
        },
        {
          marketValue: '20000000',
          share: 1,
        },
      ],
    },
  }

  const answersWithNoAsssets: FormValue = {
    estate: {
      assets: [],
    },
  }

  it('should return the sum in a currency format: "45.200.000 kr"', () => {
    expect(getMarketValueShare(answers)).toEqual('45.200.000 kr.')
  })

  it('should return an empty string', () => {
    expect(getMarketValueShare(answersWithNoAsssets)).toEqual('')
  })
})
