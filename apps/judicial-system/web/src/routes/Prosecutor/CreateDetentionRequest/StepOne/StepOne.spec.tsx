import React from 'react'
import { render, waitFor, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, MemoryRouter } from 'react-router-dom'
import StepOne, { CreateCaseMutation } from './StepOne'
import * as Constants from '../../../../utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { CaseGender, UpdateCase } from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/krafa with an id', () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa/test_id_2']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () =>
          (screen.getByLabelText(
            'Slá inn LÖKE málsnúmer *',
          ) as HTMLInputElement).value,
      ),
    ).toEqual('000-0000-0000')

    expect(
      screen.getByRole('radio', { name: 'Karl' }) as HTMLInputElement,
    ).toBeChecked()

    expect(
      (screen.getByLabelText('Kennitala *') as HTMLInputElement).value,
    ).toEqual('111111-1110')

    expect(
      (screen.getByLabelText('Fullt nafn *') as HTMLInputElement).value,
    ).toEqual('Jon Harring')

    expect(
      (screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement)
        .value,
    ).toEqual('Harringvej 2')

    expect(
      (screen.getByLabelText('Nafn verjanda') as HTMLInputElement).value,
    ).toEqual('Saul Goodman')

    expect(
      (screen.getByLabelText('Netfang verjanda') as HTMLInputElement).value,
    ).toEqual('saul@goodman.com')
  }, 15000)

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa/test_id_3']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
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

  test('should have a disabled defender name and email if judge has set a defender', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SINGLE_REQUEST_BASE_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () => screen.getByLabelText('Nafn verjanda') as HTMLInputElement,
      ),
    ).toBeDisabled()

    expect(
      screen.getByLabelText('Netfang verjanda') as HTMLInputElement,
    ).toBeDisabled()
  })

  test('should have a disabled defender name and email even if a judge erases that info from the hearing arrangement screen', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SINGLE_REQUEST_BASE_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    // A value is considered dirty if it's a string, even an empty one.
    expect(
      await waitFor(
        () => screen.getByLabelText('Nafn verjanda') as HTMLInputElement,
      ),
    ).toBeDisabled()

    expect(
      screen.getByLabelText('Netfang verjanda') as HTMLInputElement,
    ).toBeDisabled()
  })
})

describe('/krafa without ID', () => {
  test('should have a create case button', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByRole('button', { name: /Stofna kröfu/ })),
    ).toBeInTheDocument()
  })

  test('should display an empty form if there is no id in url', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act
    const textInputs = [
      await waitFor(() => screen.getByLabelText('Slá inn LÖKE málsnúmer *')),
      await waitFor(() => screen.getByLabelText('Kennitala *')),
      await waitFor(() => screen.getByLabelText('Fullt nafn *')),
      await waitFor(() => screen.getByLabelText('Lögheimili/dvalarstaður *')),
      await waitFor(() => screen.getByLabelText('Nafn verjanda')),
      await waitFor(() => screen.getByLabelText('Netfang verjanda')),
    ]

    // Assert
    expect(textInputs.filter((a) => a.innerHTML !== '').length).toEqual(0)
    expect(
      screen.getByRole('radio', { name: 'Karl' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'Kona' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'Annað' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
  })

  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'testid',
              accusedName: 'Jon Harring',
            } as UpdateCase,
            {
              id: 'testid',
              accusedAddress: 'Harringvej 2',
            } as UpdateCase,
            {
              id: 'testid',
              accusedGender: CaseGender.FEMALE,
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await waitFor(
        () =>
          screen.getByLabelText('Slá inn LÖKE málsnúmer *') as HTMLInputElement,
      ),
      '000-0000-0010',
    )

    userEvent.click(screen.getByRole('radio', { name: 'Kona' }))

    userEvent.type(
      screen.getByLabelText('Kennitala *') as HTMLInputElement,
      '1112902539',
    )

    userEvent.type(
      screen.getByLabelText('Fullt nafn *') as HTMLInputElement,
      'Jon Harring',
    )

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement,
      'Harringvej 2',
    )

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })
})
