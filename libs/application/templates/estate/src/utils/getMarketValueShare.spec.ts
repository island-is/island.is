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
      ],
    },
  }

  it('should return the sum in a currency format: "45.000.000 kr"', () => {
    expect(getMarketValueShare(answers)).toEqual('45.000.000 kr.')
  })
})
