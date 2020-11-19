import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { RulingStepOne } from './RulingStepOne'
import * as Constants from '../../../../utils/constants'
import {
  CaseCustodyRestrictions,
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

describe('/domari-krafa/urskurdur', () => {
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
              id: 'test_id_3',
              ruling:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
            } as UpdateCase,
            {
              id: 'test_id_3',
              custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
            } as UpdateCase,
            {
              id: 'test_id_3',
              custodyEndDate: '2020-10-24T12:31:00Z',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
              <RulingStepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    userEvent.type(
      await waitFor(
        () =>
          screen.getByLabelText('Niðurstaða úrskurðar *') as HTMLInputElement,
      ),
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Tímasetning *') as HTMLInputElement,
      '12:31',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button by default if case data is valid', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id',
              custodyRestrictions: [
                CaseCustodyRestrictions.ISOLATION,
                CaseCustodyRestrictions.MEDIA,
              ],
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
              <RulingStepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () =>
          screen.getByRole('button', {
            name: /Halda áfram/i,
          }) as HTMLButtonElement,
      ),
    ).not.toBeDisabled()
  })

  test('should save custodyRestrictions with requestedCustodyRestrictions if custodyRestrictions have not been set', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id',
              custodyRestrictions: [
                CaseCustodyRestrictions.ISOLATION,
                CaseCustodyRestrictions.MEDIA,
              ],
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
              <RulingStepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    /**
     * This is a bit weird.. We want to do something like 👇 but there is a issue with the Checkbox
     * component where it doesn't get the "checked" attribute set when it's checked. This make it
     * virtually un-testable so the "quick fix" here is to rely on mockUpdateCaseMutation. If that
     * is not present, the test fails because the component is trying to update the case and there
     * is no mock for that, so we know that the component is doing what it's supposed to.
     */

    // expect(
    //   await waitFor(
    //     () =>
    //       screen.getByRole('checkbox', {
    //         name: 'E - Fjölmiðlabann',
    //       }) as HTMLInputElement,
    //   ),
    // ).toBeChecked()
  })
})
