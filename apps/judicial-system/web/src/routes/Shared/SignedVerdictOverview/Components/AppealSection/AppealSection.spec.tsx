import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { CaseState } from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseOrigin,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { LocaleProvider } from '@island.is/localization'

import AppealSection from './AppealSection'

describe('Appeal section component', () => {
  const baseWorkingCase = {
    id: 'test',
    created: new Date().toString(),
    modified: new Date().toString(),
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    policeCaseNumbers: ['000'],
    defendants: [{ nationalId: '000000-0000' }] as Defendant[],
    origin: CaseOrigin.UNKNOWN,
    defendantWaivesRightToCounsel: false,
  }

  test('should say when a case is no longer appealable if either the prosecutors or judges appeal decision is to postpone', async () => {
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={{
              ...baseWorkingCase,
              isAppealDeadlineExpired: true,
              rulingDate: '2020-09-16T19:50:00.000Z',
              accusedAppealDecision: CaseAppealDecision.POSTPONE,
            }}
            setAccusedAppealDate={() => null}
            setProsecutorAppealDate={() => null}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText(
        'Kærufrestur rann út 19. september 2020 kl. 19:50',
      ),
    ).toBeInTheDocument()
  })

  test('should say when the appeal deadline is if the appeal deadline has not expired and either the prosecutors or judges appeal decision is to postpone', async () => {
    const d = new Date()
    const dd = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${(
      '0' + d.getDate()
    ).slice(-2)}`

    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={{
              ...baseWorkingCase,
              isAppealDeadlineExpired: false,
              rulingDate: `${dd}T19:50:00.000Z`,
              prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
            }}
            setAccusedAppealDate={() => null}
            setProsecutorAppealDate={() => null}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      /**
       * Only test substring because it's hard to test the exact date because
       * it's three days in the future
       */
      await screen.findByText(`Kærufrestur rennur út`, {
        exact: false,
      }),
    ).toBeInTheDocument()
  })

  test('should not say when the appeal deadline is if  neither the prosecutors or judges appeal decision is to postpone', () => {
    const d = new Date()
    const dd = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${(
      '0' + d.getDate()
    ).slice(-2)}`

    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={{
              ...baseWorkingCase,
              isAppealDeadlineExpired: false,
              rulingDate: `${dd}T19:50:00.000Z`,
            }}
            setAccusedAppealDate={() => null}
            setProsecutorAppealDate={() => null}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      /**
       * Only test substring because it's hard to test the exact date because
       * it's three days in the future
       */
      screen.queryByText(`Kærufrestur rennur út`, {
        exact: false,
      }),
    ).not.toBeInTheDocument()
  })

  test('should not show the "Accused appeals" button if the accused cannot appeal', async () => {
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={baseWorkingCase}
            setAccusedAppealDate={() => null}
            setProsecutorAppealDate={() => null}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      screen.queryByRole('button', { name: 'Varnaraðili kærir úrskurðinn' }),
    ).not.toBeInTheDocument()
  })

  test('should not show the "Prosecutor appeals" button if the prosecutor cannot appeal', async () => {
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={baseWorkingCase}
            setAccusedAppealDate={() => null}
            setProsecutorAppealDate={() => null}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    expect(
      screen.queryByRole('button', { name: 'Sækjandi kærir úrskurðinn' }),
    ).not.toBeInTheDocument()
  })
})
