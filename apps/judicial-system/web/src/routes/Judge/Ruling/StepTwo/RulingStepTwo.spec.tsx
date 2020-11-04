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
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'

describe('/domari-krafa/urskurdarord', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    // Act and Assert
    render(
      <MockedProvider
        mocks={mockCaseQueries.concat(
          mockUpdateCaseMutation([
            {
              accusedAppealDecision: CaseAppealDecision.APPEAL,
            } as UpdateCase,
            {
              prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_2`]}
          >
            <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
              <RulingStepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    userEvent.click(
      await waitFor(
        () =>
          screen.getByRole('radio', {
            name: 'Kærði kærir málið',
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
    <MockedProvider mocks={mockCaseQueries} addTypename={false}>
      <userContext.Provider value={mockJudgeUserContext}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_3`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>
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
      mocks={mockCaseQueries.concat(
        mockUpdateCaseMutation([
          {
            accusedAppealDecision: CaseAppealDecision.POSTPONE,
          } as UpdateCase,
          {
            prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
          } as UpdateCase,
        ]),
      )}
      addTypename={false}
    >
      <userContext.Provider value={mockJudgeUserContext}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_2`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>
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
})

test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is ${CaseAppealDecision.APPEAL}`, async () => {
  // Arrange

  // Act
  render(
    <MockedProvider
      mocks={mockCaseQueries.concat(
        mockUpdateCaseMutation([
          {
            accusedAppealDecision: CaseAppealDecision.APPEAL,
          } as UpdateCase,
          {
            prosecutorAppealDecision: CaseAppealDecision.APPEAL,
          } as UpdateCase,
        ]),
      )}
      addTypename={false}
    >
      <userContext.Provider value={mockJudgeUserContext}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>
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
