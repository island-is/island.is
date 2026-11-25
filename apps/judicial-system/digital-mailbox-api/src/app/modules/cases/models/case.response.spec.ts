import { Institution, User, UserRole } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { CaseResponse } from './case.response'

const court = { name: 'Héraðsdómur Reykjavíkur' } as Institution
const prosecutorsOffice = {
  name: 'Lögreglustjórinn á Suðurnesjum',
} as Institution
const prosecutor = { name: 'Sigríður Saksóknari' } as User

const internalCase = (judge: User | null): InternalCaseResponse => ({
  id: 'case-id',
  courtCaseNumber: 'S-1234/2026',
  defendants: [],
  court,
  judge,
  prosecutorsOffice,
  prosecutor,
})

const informationItems = (response: CaseResponse) =>
  response.data.groups.find((group) => group.label === 'Málsupplýsingar')
    ?.items ?? []

describe('CaseResponse.fromInternalCaseResponse', () => {
  it('shows the judge when one is assigned', () => {
    const judge = {
      name: 'Dómhildur Dómari',
      role: UserRole.DISTRICT_COURT_JUDGE,
    } as User

    const response = CaseResponse.fromInternalCaseResponse(
      internalCase(judge),
      'is',
    )

    expect(informationItems(response)).toContainEqual({
      label: 'Dómari',
      value: 'Dómhildur Dómari',
    })
  })

  it('labels an assistant judge as such', () => {
    const judge = {
      name: 'Aðalheiður Aðstoðarmaður',
      role: UserRole.DISTRICT_COURT_ASSISTANT,
    } as User

    const response = CaseResponse.fromInternalCaseResponse(
      internalCase(judge),
      'is',
    )

    expect(informationItems(response)).toContainEqual({
      label: 'Aðstoðarmaður dómara',
      value: 'Aðalheiður Aðstoðarmaður',
    })
  })

  it('marks the judge as not registered when the case has none', () => {
    const response = CaseResponse.fromInternalCaseResponse(
      internalCase(null),
      'is',
    )

    expect(informationItems(response)).toContainEqual({
      label: 'Dómari',
      value: 'Ekki skráð',
    })
  })
})
