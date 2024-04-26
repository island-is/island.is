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

  const answersWithNoVehicles: FormValue = {
    vehicles: [],
  }

  it('should return the correct sum in a currency format', () => {
    expect(
      getSumFromAnswers<FormValue>(
        answers,
        'vehicles',
        'marketValue',
        (item) => !!item.enabled,
      ),
    ).toEqual('1.000.000 kr.')
  })

  it('should return an empty string', () => {
    expect(
      getSumFromAnswers<FormValue>(
        answersWithNoVehicles,
        'vehicles',
        'marketValue',
        (item) => !!item.enabled,
      ),
    ).toEqual('')
  })
})
