import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, MemoryRouter } from 'react-router-dom'
import StepOne from './StepOne'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import {
  CaseGender,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'

describe('/krafa with an id', () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_ONE_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_ONE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      ((await screen.findByLabelText(
        'Slá inn LÖKE málsnúmer *',
      )) as HTMLInputElement).value,
    ).toEqual('000-0000-0000')

    expect(
      (await screen.findByRole('radio', { name: 'Karl' })) as HTMLInputElement,
    ).toBeChecked()

    expect(
      ((await screen.findByLabelText('Kennitala *')) as HTMLInputElement).value,
    ).toEqual('111111-1110')

    expect(
      ((await screen.findByLabelText('Fullt nafn *')) as HTMLInputElement)
        .value,
    ).toEqual('Jon Harring')

    expect(
      ((await screen.findByLabelText(
        'Lögheimili/dvalarstaður *',
      )) as HTMLInputElement).value,
    ).toEqual('Harringvej 2')

    expect(
      ((await screen.findByLabelText('Nafn verjanda')) as HTMLInputElement)
        .value,
    ).toEqual('Saul Goodman')

    expect(
      ((await screen.findByLabelText('Netfang verjanda')) as HTMLInputElement)
        .value,
    ).toEqual('saul@goodman.com')
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_ONE_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_ONE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert

    expect(
      (await screen.findByRole('button', {
        name: /Halda áfram/i,
      })) as HTMLButtonElement,
    ).not.toBeDisabled()
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
        <MemoryRouter initialEntries={[Constants.STEP_ONE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.STEP_ONE_ROUTE}/:id?`}>
              <StepOne type={CaseType.CUSTODY} />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', { name: /Stofna kröfu/ }),
    ).toBeInTheDocument()
  })

  test('should display an empty form if there is no id in url', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[Constants.STEP_ONE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.STEP_ONE_ROUTE}/:id?`}>
              <StepOne type={CaseType.CUSTODY} />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act
    const textInputs = [
      await screen.findByLabelText('Slá inn LÖKE málsnúmer *'),
      await screen.findByLabelText('Kennitala *'),
      await screen.findByLabelText('Fullt nafn *'),
      await screen.findByLabelText('Lögheimili/dvalarstaður *'),
      await screen.findByLabelText('Nafn verjanda'),
      await screen.findByLabelText('Netfang verjanda'),
    ]

    // Assert
    expect(textInputs.filter((a) => a.innerHTML !== '').length).toEqual(0)
    expect(await screen.findByRole('radio', { name: 'Karl' })).not.toBeChecked()
    expect(await screen.findByRole('radio', { name: 'Kona' })).not.toBeChecked()
    expect(
      await screen.findByRole('radio', {
        name: 'Kynsegin/Annað',
      }),
    ).not.toBeChecked()
    expect(
      await screen.findByRole('button', {
        name: /Stofna kröfu/i,
      }),
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
        <MemoryRouter initialEntries={[Constants.STEP_ONE_ROUTE]}>
          <UserProvider>
            <Route path={Constants.STEP_ONE_ROUTE}>
              <StepOne type={CaseType.CUSTODY} />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await screen.findByLabelText('Slá inn LÖKE málsnúmer *'),
      '000-0000-0010',
    )

    userEvent.click(await screen.findByRole('radio', { name: 'Kona' }))

    userEvent.type(await screen.findByLabelText('Kennitala *'), '1112902539')

    userEvent.type(await screen.findByLabelText('Fullt nafn *'), 'Jon Harring')

    expect(
      await screen.findByRole('button', {
        name: /Stofna kröfu/i,
      }),
    ).toBeDisabled()

    userEvent.type(
      (await screen.findByLabelText(
        'Lögheimili/dvalarstaður *',
      )) as HTMLInputElement,
      'Harringvej 2',
    )

    expect(
      await screen.findByRole('button', {
        name: /Stofna kröfu/i,
      }),
    ).not.toBeDisabled()
  })
})
