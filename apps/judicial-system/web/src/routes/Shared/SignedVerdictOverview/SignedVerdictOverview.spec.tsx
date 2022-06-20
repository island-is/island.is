import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import { createIntl } from 'react-intl'

import {
  mockCaseQueries,
  mockInstitutionsQuery,
  mockJudgeQuery,
  mockPrisonUserQuery,
  mockProsecutorQuery,
  mockProsecutorWonderWomanQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/components'
import { LocaleProvider } from '@island.is/localization'
import FormProvider from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  getExtensionInfoText,
  rulingDateLabel,
  shouldHideNextButton,
  SignedVerdictOverview,
  titleForCase,
} from './SignedVerdictOverview'

window.scrollTo = jest.fn()

function renderSignedVerdictOverview(mocks: ReadonlyArray<MockedResponse>) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserProvider authenticated>
        <LocaleProvider locale="is" messages={{}}>
          <FormProvider>
            <SignedVerdictOverview />
          </FormProvider>
        </LocaleProvider>
      </UserProvider>
    </MockedProvider>,
  )
}

describe('Accepted case with active custody', () => {
  test('should show case files', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await screen.findByRole('button', { name: 'Rannsóknargögn (1)' }),
    ).toBeInTheDocument()
  })

  test('should allow prosecutor that belongs to the prosecutors office that created the case to open case files', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockProsecutorWonderWomanQuery,
      ...mockInstitutionsQuery,
    ])

    userEvent.click(
      await screen.findByRole('button', { name: 'Rannsóknargögn (1)' }),
    )

    expect(
      await screen.findByLabelText(
        'Opna Screen Recording 2021-04-09 at 14.39.51.mov',
      ),
    ).toBeInTheDocument()
  })

  test('should not allow judges to share case with another institution', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      screen.queryByText('Opna mál fyrir öðru embætti'),
    ).not.toBeInTheDocument()
  })

  test('should not allow prosecutors to share case with another institution if they do not belong to the prosecutors office that created the case', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockProsecutorQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      screen.queryByText('Opna mál fyrir öðru embætti'),
    ).not.toBeInTheDocument()
  })
})

describe('Accepted case with custody end time in the past', () => {
  describe('Staff role', () => {
    test('should not show any accordion items', () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_7' },
        pathname: '/krafa/test_id_2',
      }))

      render(
        <MockedProvider
          mocks={[
            ...mockCaseQueries,
            ...mockPrisonUserQuery,
            ...mockInstitutionsQuery,
          ]}
          addTypename={false}
        >
          <UserProvider authenticated>
            <LocaleProvider locale="is" messages={{}}>
              <FormProvider>
                <SignedVerdictOverview />
              </FormProvider>
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(screen.queryByTestId('accordionItems')).not.toBeInTheDocument()
    })

    test('should only have a button for the short version ruling and custody notice PDFs', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
        pathname: '/krafa/test_id_2',
      }))

      renderSignedVerdictOverview([
        ...mockCaseQueries,
        ...mockPrisonUserQuery,
        ...mockInstitutionsQuery,
      ])

      expect(screen.queryByTestId('requestPDFButton')).not.toBeInTheDocument()
      expect(screen.queryByTestId('rulingPDFButton')).not.toBeInTheDocument()
      expect(
        await screen.findByTestId('courtRecordPDFButton'),
      ).toBeInTheDocument()
      expect(
        await screen.findByTestId('custodyNoticePDFButton'),
      ).toBeInTheDocument()
    })
  })
})

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
  const prosecutor = { role: UserRole.PROSECUTOR } as User

  it.each`
    role
    ${UserRole.ADMIN}
    ${UserRole.DEFENDER}
    ${UserRole.JUDGE}
    ${UserRole.REGISTRAR}
    ${UserRole.STAFF}
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

  const prosecutor = { role: UserRole.PROSECUTOR } as User

  const fn = (theCase: Case, user?: User) =>
    getExtensionInfoText(formatMessage, theCase, user)

  it.each`
    role
    ${UserRole.ADMIN}
    ${UserRole.DEFENDER}
    ${UserRole.JUDGE}
    ${UserRole.REGISTRAR}
    ${UserRole.STAFF}
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
