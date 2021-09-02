import React from 'react'
import { render, screen } from '@testing-library/react'
import AppealSection from './AppealSection'
import { CaseState, CaseType } from '@island.is/judicial-system/types'
import { LocaleProvider } from '@island.is/localization'
import { MockedProvider } from '@apollo/client/testing'

describe('Appeal section component', () => {
  const baseWorkingCase = {
    id: 'test',
    created: new Date().toString(),
    modified: new Date().toString(),
    type: CaseType.CUSTODY,
    state: CaseState.ACCEPTED,
    policeCaseNumber: '000',
    accusedNationalId: '000000-0000',
  }

  test('should say when a case is no longer appealable', async () => {
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <AppealSection
            workingCase={{
              ...baseWorkingCase,
              isAppealDeadlineExpired: true,
              rulingDate: '2020-09-16T19:50:00.000Z',
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
      screen.queryByRole('button', { name: 'Kærði kærir úrskurðinn' }),
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
