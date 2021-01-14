import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import StepThree from './StepThree'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import {
  CaseCustodyProvisions,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '../../../../utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('Create detention request, step three', () => {
  test('should not allow users to continue unless every required field has been filled outt', async () => {
    // Arrange
    const todaysDate = new Date()
    const formattedTodaysDate = todaysDate.getDate().toString().padStart(2, '0')
    const formattedTodaysMonth = (todaysDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            {
              lawsBroken:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
            } as UpdateCase,
            {
              custodyProvisions: [CaseCustodyProvisions._95_1_C],
            } as UpdateCase,
            {
              requestedCustodyEndDate: '2020-11-25',
            } as UpdateCase,
            {
              requestedCustodyEndDate: '2020-11-25T13:37:00.00Z',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <StepThree />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await waitFor(
        () =>
          screen.getByLabelText(
            'Lagaákvæði sem ætluð brot kærða þykja varða við *',
          ) as HTMLInputElement,
      ),
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.click(
      screen.getByRole('checkbox', { name: 'c-lið 1. mgr. 95. gr.' }),
    )

    userEvent.type(
      screen.getByLabelText(/Gæsluvarðhald \/ farbann til */),
      `${formattedTodaysDate}.${formattedTodaysMonth}.${todaysDate.getFullYear()}`,
    )

    userEvent.type(screen.getByLabelText('Tímasetning (kk:mm) *'), '13:37')

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should display the correct requestedCustodyEndTime from api', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}>
          <UserProvider>
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepThree />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      (
        await waitFor(
          () =>
            screen.getByLabelText('Tímasetning (kk:mm) *') as HTMLInputElement,
        )
      ).value,
    ).toEqual('19:51')
  }, 10000)

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <StepThree />
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
  }, 10000)
})
