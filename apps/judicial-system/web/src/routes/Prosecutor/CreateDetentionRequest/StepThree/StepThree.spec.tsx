import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import {
  CaseCustodyProvisions,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import StepThree from './StepThree'
import formatISO from 'date-fns/formatISO'

describe('Create detention request, step three', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
    }))

    const todaysDate = new Date()
    const lastDateOfTheMonth = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth() + 1,
      0,
      13,
      37,
    )

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation(
            [
              {
                lawsBroken:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
              } as UpdateCase,
              {
                custodyProvisions: [CaseCustodyProvisions._95_1_C],
              } as UpdateCase,
              {
                requestedCustodyEndDate: formatISO(lastDateOfTheMonth),
              } as UpdateCase,
            ],
            'test_id_2',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepThree />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()

    userEvent.click(await screen.findByLabelText('Gæsluvarðhald til *'))

    const datePicker = await screen.findByTestId('date-time')

    const lastDayOfTheMonth = lastDateOfTheMonth.getDate().toString()

    const lastDays = within(datePicker).getAllByText(lastDayOfTheMonth)

    const lastDayOfCurrentMonth = lastDays[lastDays.length - 1]

    userEvent.click(lastDayOfCurrentMonth)

    userEvent.type(
      await screen.findByLabelText('Tímasetning (kk:mm) *'),
      '13:37',
    )

    // Act and Assert
    userEvent.type(
      await screen.findByLabelText(
        'Lagaákvæði sem ætluð brot kærða þykja varða við *',
      ),
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
    )

    userEvent.click(
      await screen.findByRole('checkbox', { name: 'c-lið 1. mgr. 95. gr.' }),
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should display the correct requestedCustodyEndTime from api', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepThree />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      ((await screen.findByLabelText(
        'Tímasetning (kk:mm) *',
      )) as HTMLInputElement).value,
    ).toEqual('19:51')
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepThree />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should display the custody end date of the parent case when the case is an extension', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_8' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepThree />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('Fyrri gæsla var/er til')).toBeTruthy()

    expect(
      await screen.findByText('mánudagsins 18. janúar 2021 kl. 19:50'),
    ).toBeTruthy()
  })
})
