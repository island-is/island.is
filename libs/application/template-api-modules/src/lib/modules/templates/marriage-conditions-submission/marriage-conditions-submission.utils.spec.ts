import { MarriageConditionsAnswers } from '@island.is/application/templates/marriage-conditions/types'
import {
  getCeremonyPlace,
  NATIONAL_CHURCH_PLACE,
} from './marriage-conditions-submission.utils'

type Ceremony = MarriageConditionsAnswers['ceremony']

describe('getCeremonyPlace', () => {
  it('returns the selected district commissioner office name', () => {
    const ceremony = {
      place: {
        ceremonyPlace: 'office',
        office: 'Sýslumaðurinn á höfuðborgarsvæðinu, Reykjavík',
      },
    } as Ceremony

    expect(getCeremonyPlace(ceremony)).toBe(
      'Sýslumaðurinn á höfuðborgarsvæðinu, Reykjavík',
    )
  })

  it('returns the selected religious/life-stance organization name', () => {
    const ceremony = {
      place: {
        ceremonyPlace: 'society',
        society: 'Siðmennt',
      },
    } as Ceremony

    expect(getCeremonyPlace(ceremony)).toBe('Siðmennt')
  })

  it('returns the national church name when church is selected', () => {
    const ceremony = {
      place: {
        ceremonyPlace: 'church',
      },
    } as Ceremony

    expect(getCeremonyPlace(ceremony)).toBe(NATIONAL_CHURCH_PLACE)
    expect(getCeremonyPlace(ceremony)).toBe('Þjóðkirkjan')
  })

  it('returns the national church name even if a stale society value lingers', () => {
    const ceremony = {
      place: {
        ceremonyPlace: 'church',
        society: 'Siðmennt',
      },
    } as Ceremony

    expect(getCeremonyPlace(ceremony)).toBe(NATIONAL_CHURCH_PLACE)
  })

  it('returns an empty string when the place is not decided', () => {
    const ceremony = {
      place: {
        ceremonyPlace: 'none',
      },
    } as Ceremony

    expect(getCeremonyPlace(ceremony)).toBe('')
  })

  it('returns an empty string when no place is set', () => {
    expect(getCeremonyPlace({} as Ceremony)).toBe('')
  })
})
