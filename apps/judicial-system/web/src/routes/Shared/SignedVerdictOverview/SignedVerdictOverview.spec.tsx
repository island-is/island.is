import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { getByText } from '@testing-library/dom'
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
import { formatDate } from '@island.is/judicial-system/formatters'
import { LocaleProvider } from '@island.is/localization'
import FormProvider from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

import {
  rulingDateLabel,
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

describe('Rejected case', () => {
  test('should not show restrictions tag if case is rejected event though there are restrictions', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

  })

  test('should not show a button for extension', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockProsecutorQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await waitFor(() =>
        screen.queryByRole('button', { name: 'Framlengja gæslu' }),
      ),
    ).not.toBeInTheDocument()

    expect(await screen.findByTestId('infobox')).toHaveTextContent(
      'Ekki hægt að framlengja gæsluvarðhald sem var hafnað.',
    )
  })
})

describe('Dismissed case', () => {
  test('should not show restrictions tag event though there are restrictions', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_12' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

  })

  test('should not show a button for extension', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_12' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockProsecutorQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await waitFor(() =>
        screen.queryByRole('button', { name: 'Framlengja gæslu' }),
      ),
    ).not.toBeInTheDocument()

    expect(await screen.findByTestId('infobox')).toHaveTextContent(
      'Ekki hægt að framlengja gæsluvarðhald sem var vísað frá.',
    )
  })
})

describe('Accepted case with active custody', () => {
  test('should have the correct subtitle', async () => {
    const validToDate = '2020-09-25T19:50:08.033Z'

    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_5' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await screen.findByText(
        `Gæsla til ${formatDate(validToDate, 'PPP')} kl. ${formatDate(
          validToDate,
          TIME_FORMAT,
        )}`,
      ),
    ).toBeInTheDocument()
  })

  test('should show restrictions tag if there are restrictions', async () => {
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

  })

  test('should not show a button for extension because the user is a judge', async () => {
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
      await waitFor(() =>
        screen.queryByRole('button', { name: 'Framlengja gæslu' }),
      ),
    ).not.toBeInTheDocument()
  })

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
 describe('Court roles', () => {
    test('should have the correct subtitle', async () => {
      const dateInPast = '2020-09-24T19:50:08.033Z'

      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_6' },
        pathname: '/krafa/test_id_2',
      }))

      renderSignedVerdictOverview([
        ...mockCaseQueries,
        ...mockJudgeQuery,
        ...mockInstitutionsQuery,
      ])

      expect(
        await screen.findByText(
          `Gæsla rann út ${formatDate(dateInPast, 'PPP')} kl. ${formatDate(
            dateInPast,
            TIME_FORMAT,
          )}`,
        ),
      ).toBeInTheDocument()
    })

    test('should display restriction tags if the prosecutor requested restrictions', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_6' },
        pathname: '/krafa/test_id_2',
      }))

      renderSignedVerdictOverview([
        ...mockCaseQueries,
        ...mockJudgeQuery,
        ...mockInstitutionsQuery,
      ])

    test('should not show a button for extension', async () => {
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
        await waitFor(() =>
          screen.queryByRole('button', { name: 'Framlengja gæslu' }),
        ),
      ).not.toBeInTheDocument()
    })
  })

  describe('Prosecutor role', () => {
    test('should display an indicator that the case cannot be extended', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_8' },
        pathname: '/krafa/test_id_2',
      }))

      renderSignedVerdictOverview([
        ...mockCaseQueries,
        ...mockProsecutorQuery,
        ...mockInstitutionsQuery,
      ])

      expect(await screen.findByTestId('infobox')).toHaveTextContent(
        'Ekki hægt að framlengja gæsluvarðhald þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.',
      )
    })
  })

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
describe('Accepted case with active travel ban', () => {
  test('should have the correct subtitle', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_7' },
      pathname: '/krafa/test_id_2',
    }))
    const date = '2020-09-25T19:50:08.033Z'

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await screen.findByText(
        `Farbann til ${formatDate(date, 'PPP')} kl. ${formatDate(
          date,
          TIME_FORMAT,
        )}`,
      ),
    ).toBeInTheDocument()
  })

  test('should not show a button for extension because the user is a judge', async () => {
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
      await waitFor(() =>
        screen.queryByRole('button', { name: 'Framlengja gæslu' }),
      ),
    ).not.toBeInTheDocument()
  })

  test('should not show an extension for why the case cannot be extended if the user is a prosecutor', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_7' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockProsecutorQuery,
      ...mockInstitutionsQuery,
    ])

    expect(await screen.findByTestId('infobox')).toHaveTextContent(
      'Ekki hægt að framlengja gæsluvarðhald þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.',
    )
  })
})

describe('Accepted case with travel ban end time in the past', () => {
  test('should have the correct subtitle', async () => {
    const dateInPast = '2020-09-24T19:50:08.033Z'
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_8' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    expect(
      await screen.findByText(
        `Farbann rann út ${formatDate(dateInPast, 'PPP')} kl. ${formatDate(
          dateInPast,
          TIME_FORMAT,
        )}`,
      ),
    ).toBeInTheDocument()
  })

  test('should show a button for extension because the user is a prosecutor', async () => {
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
      await screen.findByRole('button', { name: 'Framlengja gæslu' }),
    ).toBeInTheDocument()
  })
})

describe('Accepted case with adission to facility with end time in the past', () => {
  test('should have the correct subtitle', async () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_13' },
      pathname: '/krafa/test_id_2',
    }))

    renderSignedVerdictOverview([
      ...mockCaseQueries,
      ...mockJudgeQuery,
      ...mockInstitutionsQuery,
    ])

    const caseDates = await screen.findByTestId('caseDates')

    expect(
      getByText(caseDates, 'Vistun rann út 24. september 2020 kl. 19:50'),
    ).toBeTruthy()
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
