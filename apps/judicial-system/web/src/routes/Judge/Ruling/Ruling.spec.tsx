import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { RulingStepOne, RulingStepTwo } from './'
import * as Constants from '../../../utils/constants'
import {
  CaseAppealDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {
  mockCaseQueries,
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'

describe('Ruling routes', () => {
  describe(Constants.RULING_STEP_ONE_ROUTE, () => {
    test('should not allow users to continue unless every required field has been filled out', async () => {
      // Arrange

      // Act and Assert
      render(
        <MockedProvider
          mocks={mockCaseQueries.concat(
            mockUpdateCaseMutation([
              {
                ruling:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
              } as UpdateCase,
              {
                custodyEndDate: '2020-10-24T12:31:00Z',
              } as UpdateCase,
            ]),
          )}
          addTypename={false}
        >
          <userContext.Provider value={mockJudgeUserContext}>
            <MemoryRouter
              initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id_3`]}
            >
              <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
                <RulingStepOne />
              </Route>
            </MemoryRouter>
          </userContext.Provider>
        </MockedProvider>,
      )

      userEvent.type(
        await waitFor(() => screen.getByTestId('ruling') as HTMLInputElement),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
      )
      userEvent.tab()
      expect(
        screen.getByTestId('continueButton') as HTMLButtonElement,
      ).toBeDisabled()

      await userEvent.type(
        screen.getByTestId('custodyEndTime') as HTMLInputElement,
        '12:31',
      )
      userEvent.tab()
      expect(
        screen.getByTestId('continueButton') as HTMLButtonElement,
      ).not.toBeDisabled()
    })

    test('should not have a disabled continue button by default if case data is valid', async () => {
      // Arrange

      // Act
      render(
        <MockedProvider mocks={mockCaseQueries} addTypename={false}>
          <userContext.Provider value={mockJudgeUserContext}>
            <MemoryRouter
              initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id`]}
            >
              <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
                <RulingStepOne />
              </Route>
            </MemoryRouter>
          </userContext.Provider>
        </MockedProvider>,
      )

      // Assert
      expect(
        await waitFor(
          () => screen.getByTestId('continueButton') as HTMLButtonElement,
        ),
      ).not.toBeDisabled()
    })
  })

  describe(Constants.RULING_STEP_TWO_ROUTE, () => {
    test('should not allow users to continue unless every required field has been filled out', async () => {
      // Arrange

      // Act and Assert
      render(
        <MockedProvider
          mocks={mockCaseQueries.concat(
            mockUpdateCaseMutation([
              {
                prosecutorAppealDecision: CaseAppealDecision.APPEAL,
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
          screen.getByLabelText('Sækjandi kærir málið') as HTMLInputElement,
        ),
      )

      expect(
        screen.getByTestId('continueButton') as HTMLButtonElement,
      ).toBeDisabled()

      await waitFor(() =>
        userEvent.click(screen.getByLabelText('Sækjandi kærir málið')),
      )

      waitFor(() => {
        expect(
          screen.getByTestId('continueButton') as HTMLButtonElement,
        ).not.toBeDisabled()
      })
    })
  })

  test('should not have a selected radio button by default', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
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
      userEvent.click(screen.getByText('Kærði tekur sér lögboðinn frest')),
    )
    await waitFor(() =>
      userEvent.click(screen.getByText('Sækjandi tekur sér lögboðinn frest')),
    )

    // Assert
    expect(screen.getByTestId('accusedAppealAnnouncement')).toBeDisabled()

    expect(screen.getByTestId('prosecutorAppealAnnouncement')).toBeDisabled()
  })

  test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    const { getByText, getByTestId } = render(
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
            initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id_2`]}
          >
            <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
              <RulingStepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => userEvent.click(getByText('Kærði kærir málið')))
    await waitFor(() => userEvent.click(getByText('Sækjandi kærir málið')))

    // Assert
    expect(getByTestId('accusedAppealAnnouncement')).not.toBeDisabled()
    expect(getByTestId('prosecutorAppealAnnouncement')).not.toBeDisabled()
  })
})
