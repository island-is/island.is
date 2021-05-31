import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import {
  mockCaseQueries,
  mockInstitutionsQuery,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { CaseType } from '@island.is/judicial-system/types'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import StepOne from './StepOne'

describe('/krafa with an id', () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
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
          ...mockProsecutorQuery,
          ...mockInstitutionsQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepOne />
        </UserProvider>
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
    ).toEqual('000000-0000')

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
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockInstitutionsQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepOne />
        </UserProvider>
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
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: undefined },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockInstitutionsQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepOne type={CaseType.CUSTODY} />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    // Wierd enough, this expect has to be here. Otherwise, an "was not wrapped in act" warning is shown
    expect(
      await screen.findByLabelText('Slá inn LÖKE málsnúmer *'),
    ).toBeInTheDocument()

    expect(await screen.findByText('Stofna kröfu')).toBeTruthy()
  })

  test('should display an empty form if the user goes to /ny/[type]', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: undefined },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockInstitutionsQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepOne type={CaseType.CUSTODY} />
        </UserProvider>
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
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: undefined },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockInstitutionsQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepOne type={CaseType.CUSTODY} />
        </UserProvider>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await screen.findByLabelText('Slá inn LÖKE málsnúmer *'),
      '000-0000-0010',
    )

    userEvent.click(await screen.findByRole('radio', { name: 'Kona' }))

    userEvent.type(await screen.findByLabelText('Kennitala *'), '000000-0000')

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

    userEvent.type(
      await screen.findByLabelText(/Sláðu inn stjórnanda rannsóknar/),
      'Ben 10',
    )

    expect(
      await screen.findByRole('button', {
        name: /Stofna kröfu/i,
      }),
    ).not.toBeDisabled()
  })
})
