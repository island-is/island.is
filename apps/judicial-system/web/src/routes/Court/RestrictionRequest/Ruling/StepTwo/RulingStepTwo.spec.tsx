/* eslint-disable local-rules/disallow-kennitalas */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { LocaleProvider } from '@island.is/localization'
import userEvent from '@testing-library/user-event'

import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { RulingStepTwo } from './RulingStepTwo'

describe('/domari-krafa/urskurdarord', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_5' },
    }))

    // Act and Assert
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                conclusion:
                  'Kærði, Jon Harring, kt. string, skal sæta gæsluvarðhaldi, þó ekki lengur en til föstudagsins 25. september 2020, kl. 19:50.',
              } as UpdateCase,
              {
                accusedAppealDecision: CaseAppealDecision.APPEAL,
              } as UpdateCase,
              {
                prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
              } as UpdateCase,
              {
                courtEndTime: '2020-09-16T15:55:000Z',
              } as UpdateCase,
            ],
            'test_id_5',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(
      (await screen.findByRole('radio', {
        name: 'Kærði kærir úrskurðinn',
      })) as HTMLInputElement,
    )

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Sækjandi tekur sér lögboðinn frest',
      }),
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()

    userEvent.type(
      await screen.findByLabelText('Þinghaldi lauk (kk:mm) *'),
      '15:55',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should not have a selected radio button by default', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                conclusion:
                  'Kærði, Jon Harring, kt. 111111-0000, skal sæta farbanni, þó ekki lengur en til fimmtudagsins 1. janúar 1970, kl. 00:00.',
              } as UpdateCase,
            ],
            'test_id_3',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      ((await screen.findAllByRole('radio')) as HTMLInputElement[]).filter(
        (input) => input.checked,
      ),
    ).toHaveLength(0)
  })

  test(`should have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is not APPEAL`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                conclusion:
                  'Kröfu um að kærði, Jon Harring, kt. 000000-0000, sæti gæsluvarðhaldi er hafnað.',
              } as UpdateCase,
              {
                accusedAppealDecision: CaseAppealDecision.POSTPONE,
              } as UpdateCase,
              {
                prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
              } as UpdateCase,
            ],
            'test_id_2',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Kærði tekur sér lögboðinn frest',
      }),
    )

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Sækjandi tekur sér lögboðinn frest',
      }),
    )

    // Assert
    expect(
      await screen.findByLabelText('Yfirlýsing um kæru kærða'),
    ).toBeDisabled()

    expect(
      await screen.findByLabelText('Yfirlýsing um kæru sækjanda'),
    ).toBeDisabled()
  })

  test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is APPEAL`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                conclusion:
                  'Kærða, Jon Harring, kt. string, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50. Kærða skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
              } as UpdateCase,
              {
                accusedAppealDecision: CaseAppealDecision.APPEAL,
              } as UpdateCase,
              {
                prosecutorAppealDecision: CaseAppealDecision.APPEAL,
              } as UpdateCase,
            ],
            'test_id',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByLabelText('Yfirlýsing um kæru kærða'),
    ).not.toBeDisabled()

    expect(
      await screen.findByLabelText('Yfirlýsing um kæru sækjanda'),
    ).not.toBeDisabled()
  })

  test('should save custodyRestrictions with requestedCustodyRestrictions if custodyRestrictions have not been set', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                custodyRestrictions: [
                  CaseCustodyRestrictions.ISOLATION,
                  CaseCustodyRestrictions.MEDIA,
                ],
              } as UpdateCase,
              {
                conclusion:
                  'Kærða, Jon Harring, kt. string, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50. Kærða skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
              } as UpdateCase,
            ],
            'test_id',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      (await screen.findByRole('checkbox', {
        name: 'E - Fjölmiðlabann',
      })) as HTMLInputElement,
    ).toBeChecked()
  })

  test('should not display the alternative travel ban retstirction section if the decision is not ACCEPTING_ALTERATIVE_TRAVEL_BAN', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                custodyRestrictions: [
                  CaseCustodyRestrictions.ISOLATION,
                  CaseCustodyRestrictions.MEDIA,
                ],
              } as UpdateCase,
              {
                conclusion:
                  'Kærða, Jon Harring, kt. string, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50. Kærða skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
              } as UpdateCase,
            ],
            'test_id',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() =>
        screen.queryByRole('checkbox', {
          name: 'Tilkynningarskylda',
        }),
      ),
    ).not.toBeInTheDocument()
  })

  test('should display the alternative travel ban retstirction section if the decision is ACCEPTING_ALTERATIVE_TRAVEL_BAN', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_7' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation(
            [
              {
                conclusion:
                  'Kærði, Jon Harring, kt. string, skal sæta farbanni, þó ekki lengur en til föstudagsins 25. september 2020, kl. 19:50.',
              } as UpdateCase,
            ],
            'test_id_7',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <RulingStepTwo />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('checkbox', {
        name: 'Tilkynningarskylda',
      }),
    ).toBeInTheDocument()
  })
})
