import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
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
          <RulingStepTwo />
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
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepTwo />
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

  test(`should have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is not ${CaseAppealDecision.APPEAL}`, async () => {
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
          <RulingStepTwo />
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

  test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is ${CaseAppealDecision.APPEAL}`, async () => {
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
          <RulingStepTwo />
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
            ],
            'test_id',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepTwo />
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
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepTwo />
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
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepTwo />
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
