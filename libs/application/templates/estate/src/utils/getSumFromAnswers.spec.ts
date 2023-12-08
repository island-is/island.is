import { FormValue } from '@island.is/application/types'
import { getSumFromAnswers } from './getSumFromAnswers'

describe('getSumFromAnswers', () => {
  const answers: FormValue = {
    vehicles: [
      {
        marketValue: '500000',
        enabled: false,
      },
      {
        marketValue: '500000',
        enabled: true,
      },
      {
        marketValue: '500000',
        enabled: true,
      },
    ],
  }

  it('should return the sum in a currency format: "1.000.000 kr"', () => {
    expect(
      getSumFromAnswers<FormValue>(
        answers,
        'vehicles',
        'marketValue',
        (item) => !!item.enabled,
      ),
    ).toEqual('1.000.000 kr.')
  })
})
