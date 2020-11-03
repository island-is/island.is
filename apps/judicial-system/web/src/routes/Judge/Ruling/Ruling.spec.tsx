import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
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
      const { getByTestId } = render(
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

      await act(async () => {
        userEvent.type(
          await waitFor(() => getByTestId('ruling') as HTMLInputElement),
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
        )
        userEvent.tab()
        expect(
          getByTestId('continueButton') as HTMLButtonElement,
        ).toBeDisabled()

        await userEvent.type(
          getByTestId('custodyEndTime') as HTMLInputElement,
          '12:31',
        )
        userEvent.tab()
        expect(
          getByTestId('continueButton') as HTMLButtonElement,
        ).not.toBeDisabled()
      })
    })

    test('should not have a disabled continue button by default if case data is valid', async () => {
      // Arrange

      // Act
      const { getByTestId } = render(
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
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).not.toBeDisabled()
    })
  })

  describe(Constants.RULING_STEP_TWO_ROUTE, () => {
    test('should not allow users to continue unless every required field has been filled out', async () => {
      // Arrange

      // Act and Assert
      const { getByLabelText, getByTestId } = render(
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
          getByLabelText('Sækjandi kærir málið') as HTMLInputElement,
        ),
      )

      expect(getByTestId('continueButton') as HTMLButtonElement).toBeDisabled()

      await waitFor(() =>
        userEvent.click(getByLabelText('Sækjandi kærir málið')),
      )

      waitFor(() => {
        expect(
          getByTestId('continueButton') as HTMLButtonElement,
        ).not.toBeDisabled()
      })
    })
  })

  test('should not have a selected radio button by default', async () => {
    // Arrange

    // Act
    const { getAllByRole } = render(
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
      (await waitFor(() => getAllByRole('radio') as HTMLInputElement[])).filter(
        (input) => input.checked,
      ),
    ).toHaveLength(0)
  })

  test(`should have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    const { getByText, getByTestId } = render(
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
      userEvent.click(getByText('Kærði tekur sér lögboðinn frest')),
    )
    await waitFor(() =>
      userEvent.click(getByText('Sækjandi tekur sér lögboðinn frest')),
    )

    // Assert
    expect(
      getByTestId('accusedAppealAnnouncement').hasAttribute('disabled'),
    ).toEqual(true)

    expect(
      getByTestId('prosecutorAppealAnnouncement').hasAttribute('disabled'),
    ).toEqual(true)
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
    expect(
      getByTestId('accusedAppealAnnouncement').hasAttribute('disabled'),
    ).toEqual(false)
    expect(
      getByTestId('prosecutorAppealAnnouncement').hasAttribute('disabled'),
    ).toEqual(false)
  })
})
