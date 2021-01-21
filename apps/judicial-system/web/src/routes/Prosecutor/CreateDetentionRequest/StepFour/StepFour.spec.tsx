import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import StepFour from './StepFour'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { UpdateCase } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('Create detention request, step four', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            { caseFacts: 'Lorem ipsum dolor sit amet,' } as UpdateCase,
            {
              legalArguments:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_FOUR_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_FOUR_ROUTE}/:id`}>
              <StepFour />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await waitFor(
        () => screen.getByLabelText('Málsatvik *') as HTMLInputElement,
      ),
      'Lorem ipsum dolor sit amet,',
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Lagarök *') as HTMLInputElement,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[`${Constants.STEP_FOUR_ROUTE}/test_id`]}>
          <UserProvider>
            <Route path={`${Constants.STEP_FOUR_ROUTE}/:id`}>
              <StepFour />
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
})
