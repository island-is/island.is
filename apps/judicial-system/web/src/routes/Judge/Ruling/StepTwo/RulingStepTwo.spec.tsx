import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { RulingStepTwo } from './RulingStepTwo'
import * as Constants from '../../../../utils/constants'
import {
  CaseAppealDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/domari-krafa/urskurdarord', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    // Act and Assert
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              accusedAppealDecision: CaseAppealDecision.APPEAL,
            } as UpdateCase,
            {
              prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
              <RulingStepTwo />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    userEvent.click(
      await waitFor(
        () =>
          screen.getByRole('radio', {
            name: 'Kærði kærir úrskurðinn',
          }) as HTMLInputElement,
      ),
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.click(
      screen.getByRole('radio', {
        name: 'Sækjandi tekur sér lögboðinn frest',
      }) as HTMLInputElement,
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })
})

test('should not have a selected radio button by default', async () => {
  // Arrange

  // Act
  render(
    <MockedProvider
      mocks={[...mockCaseQueries, ...mockJudgeQuery]}
      addTypename={false}
    >
      <MemoryRouter
        initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_3`]}
      >
        <UserProvider>
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </UserProvider>
      </MemoryRouter>
    </MockedProvider>,
  )

  // Assert
  expect(
    (
      await waitFor(() => screen.getAllByRole('radio') as HTMLInputElement[])
    ).filter((input) => input.checked),
  ).toHaveLength(0)
})

test(`should have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is not ${CaseAppealDecision.APPEAL}`, async () => {
  // Arrange

  // Act
  render(
    <MockedProvider
      mocks={[
        ...mockCaseQueries,
        ...mockJudgeQuery,
        ...mockUpdateCaseMutation([
          {
            accusedAppealDecision: CaseAppealDecision.POSTPONE,
          } as UpdateCase,
          {
            prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
          } as UpdateCase,
        ]),
      ]}
      addTypename={false}
    >
      <MemoryRouter
        initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_2`]}
      >
        <UserProvider>
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </UserProvider>
      </MemoryRouter>
    </MockedProvider>,
  )

  await waitFor(() =>
    userEvent.click(
      screen.getByRole('radio', { name: 'Kærði tekur sér lögboðinn frest' }),
    ),
  )

  userEvent.click(
    screen.getByRole('radio', {
      name: 'Sækjandi tekur sér lögboðinn frest',
    }),
  )

  // Assert
  expect(
    await waitFor(() => screen.getByLabelText('Yfirlýsing um kæru kærða')),
  ).toBeDisabled()
  expect(screen.getByLabelText('Yfirlýsing um kæru sækjanda')).toBeDisabled()
}, 10000)

test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is ${CaseAppealDecision.APPEAL}`, async () => {
  // Arrange

  // Act
  render(
    <MockedProvider
      mocks={[
        ...mockCaseQueries,
        ...mockJudgeQuery,
        ...mockUpdateCaseMutation([
          {
            accusedAppealDecision: CaseAppealDecision.APPEAL,
          } as UpdateCase,
          {
            prosecutorAppealDecision: CaseAppealDecision.APPEAL,
          } as UpdateCase,
        ]),
      ]}
      addTypename={false}
    >
      <MemoryRouter
        initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
      >
        <UserProvider>
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </UserProvider>
      </MemoryRouter>
    </MockedProvider>,
  )

  // Assert
  expect(
    await waitFor(() => screen.getByLabelText('Yfirlýsing um kæru kærða')),
  ).not.toBeDisabled()
  expect(
    screen.getByLabelText('Yfirlýsing um kæru sækjanda'),
  ).not.toBeDisabled()
})
