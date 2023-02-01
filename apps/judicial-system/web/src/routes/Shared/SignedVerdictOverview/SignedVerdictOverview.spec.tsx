import { createIntl } from 'react-intl'

import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getExtensionInfoText,
  rulingDateLabel,
  shouldHideNextButton,
  titleForCase,
} from './SignedVerdictOverview'

window.scrollTo = jest.fn()

describe('titleForCase', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn })
    .formatMessage
  const fn = (theCase: Case) => titleForCase(formatMessage, theCase)

  test('should handle rejected investigation case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.BODY_SEARCH,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu um rannsóknarheimild hafnað')
  })

  test('should handle rejected restriction case', () => {
    const theCase = {
      state: CaseState.REJECTED,
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu hafnað')
  })

  test('should handle dismissed case', () => {
    const theCase = { state: CaseState.DISMISSED } as Case
    const res = fn(theCase)
    expect(res).toEqual('Kröfu vísað frá')
  })

  test('should handle custody case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhaldi lokið')
  })

  test('should handle admission case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun lokið')
  })

  test('should handle travel ban case with valid to date in past', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Farbanni lokið')
  })

  test('should handle accepted investigation case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.SEARCH_WARRANT,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Krafa um rannsóknarheimild samþykkt')
  })

  test('should handle active custody case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Gæsluvarðhald virkt')
  })

  test('should handle active admission case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.ADMISSION_TO_FACILITY,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Vistun á viðeigandi stofnun virk')
  })

  test('should handle active travel case', () => {
    const theCase = {
      state: CaseState.ACCEPTED,
      type: CaseType.TRAVEL_BAN,
    } as Case
    const res = fn(theCase)
    expect(res).toEqual('Farbann virkt')
  })
})

describe('rulingDateLabel', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn })
    .formatMessage
  test('should format correctly', () => {
    const theCase = { courtEndTime: '2020-09-16T19:51:28.224Z' } as Case
    expect(rulingDateLabel(formatMessage, theCase)).toEqual(
      'Úrskurðað 16. september 2020 kl. 19:51',
    )
  })
})

describe('shouldHideNextButton', () => {
  const prosecutor = { role: UserRole.Prosecutor } as User

  it.each`
    role
    ${UserRole.Admin}
    ${UserRole.Defender}
    ${UserRole.Judge}
    ${UserRole.Registrar}
    ${UserRole.Staff}
  `('should hide next button for user role: $role', ({ role }) => {
    const theCase = {} as Case
    const res = shouldHideNextButton(theCase, { role } as User)
    expect(res).toEqual(true)
  })

  test('should show next button for user role: PROSECUTOR', () => {
    const theCase = {} as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(false)
  })

  test('should hide next button if decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN', () => {
    const theCase = {
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
    } as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(true)
  })

  test('should hide next button if case is rejected', () => {
    const theCase = { state: CaseState.REJECTED } as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(true)
  })

  test('should hide next button if case is dismissed', () => {
    const theCase = { state: CaseState.DISMISSED } as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(true)
  })

  test('should hide next button if case has valid to date in the past', () => {
    const theCase = { isValidToDateInThePast: true } as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(true)
  })

  test('should hide next button if case has a child case', () => {
    const theCase = { childCase: {} as Case } as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(true)
  })
})

describe('getExtensionInfoText', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn })
    .formatMessage

  const prosecutor = { role: UserRole.Prosecutor } as User

  const fn = (theCase: Case, user?: User) =>
    getExtensionInfoText(formatMessage, theCase, user)

  it.each`
    role
    ${UserRole.Admin}
    ${UserRole.Defender}
    ${UserRole.Judge}
    ${UserRole.Registrar}
    ${UserRole.Staff}
  `('should return undefined for user role: $role', ({ role }) => {
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.REJECTED,
    } as Case
    const res = fn(theCase, { role } as User)

    expect(res).toBeUndefined()
  })

  test('should format for rejected custody case', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.REJECTED,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Ekki hægt að framlengja gæsluvarðhald sem var hafnað.')
  })

  test('should format for rejected admission case', () => {
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.REJECTED,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual(
      'Ekki hægt að framlengja vistun á viðeigandi stofnun sem var hafnað.',
    )
  })

  test('should format for rejected travel ban case', () => {
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      state: CaseState.REJECTED,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Ekki hægt að framlengja farbann sem var hafnað.')
  })

  test('should format for rejected investigation case', () => {
    const theCase = {
      type: CaseType.SEARCH_WARRANT,
      state: CaseState.REJECTED,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Ekki hægt að framlengja kröfu sem var hafnað.')
  })

  test('should format for dismissed investigation case', () => {
    const theCase = {
      type: CaseType.SEARCH_WARRANT,
      state: CaseState.DISMISSED,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Ekki hægt að framlengja kröfu sem var vísað frá.')
  })

  test('should format for custody case with valid to date in the past', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      isValidToDateInThePast: true,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Ekki hægt að framlengja gæsluvarðhald sem er lokið.')
  })

  test('should format for case with accepting alternative travel ban', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual(
      'Ekki hægt að framlengja gæsluvarðhald þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.',
    )
  })

  test('should format for custody case with a child case', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      childCase: {} as Case,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toEqual('Framlengingarkrafa hefur þegar verið útbúin.')
  })

  test('should fallback to undefined', () => {
    const theCase = {
      type: CaseType.CUSTODY,
    } as Case
    const res = fn(theCase, prosecutor)

    expect(res).toBeUndefined()
  })
})
