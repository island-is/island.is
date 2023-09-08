import { createIntl } from 'react-intl'
import { uuid } from 'uuidv4'

import { CaseDecision, CaseState } from '@island.is/judicial-system/types'
import {
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import {
  getExtensionInfoText,
  shouldHideNextButton,
} from './SignedVerdictOverview'

window.scrollTo = jest.fn()

describe('shouldHideNextButton', () => {
  const prosecutor = { id: uuid(), role: UserRole.PROSECUTOR } as User

  it.each`
    role
    ${UserRole.ADMIN}
    ${UserRole.DEFENDER}
    ${UserRole.JUDGE}
    ${UserRole.REGISTRAR}
    ${UserRole.PRISON_SYSTEM_STAFF}
  `('should hide next button for user role: $role', ({ role }) => {
    const theCase = {} as Case
    const res = shouldHideNextButton(theCase, { id: uuid(), role } as User)
    expect(res).toEqual(true)
  })

  test('should show next button for user role: PROSECUTOR', () => {
    const theCase = {} as Case
    const res = shouldHideNextButton(theCase, prosecutor)
    expect(res).toEqual(false)
  })

  test('should show next button for user role: REGISTRAR if user is assinged registrar', () => {
    const userId = uuid()
    const theCase = { registrar: { id: userId } } as Case
    const res = shouldHideNextButton(theCase, {
      id: userId,
      role: UserRole.REGISTRAR,
    } as User)
    expect(res).toEqual(false)
  })

  test('should show next button for user role: JUDGE ig user is assigned judge', () => {
    const userId = uuid()
    const theCase = { judge: { id: userId } } as Case
    const res = shouldHideNextButton(theCase, {
      id: userId,
      role: UserRole.JUDGE,
    } as User)
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
  const formatMessage = createIntl({
    locale: 'is',
    onError: jest.fn,
  }).formatMessage

  const prosecutor = { role: UserRole.PROSECUTOR } as User

  const fn = (theCase: Case, user?: User) =>
    getExtensionInfoText(formatMessage, theCase, user)

  it.each`
    role
    ${UserRole.ADMIN}
    ${UserRole.DEFENDER}
    ${UserRole.JUDGE}
    ${UserRole.REGISTRAR}
    ${UserRole.PRISON_SYSTEM_STAFF}
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
