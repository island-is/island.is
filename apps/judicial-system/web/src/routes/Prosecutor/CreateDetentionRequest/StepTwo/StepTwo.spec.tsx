import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import StepTwo from './StepTwo'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import {
  CaseCustodyProvisions,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import * as Constants from '../../../../utils/constants'
import {
  mockCaseQueries,
  mockProsecutorUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe('Create detention request, step two', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    render(
      <MockedProvider
        mocks={mockCaseQueries.concat(
          mockUpdateCaseMutation([
            {
              requestedCustodyEndDate: '2020-09-16T13:37:00Z',
              custodyEndDate: '2020-09-16T13:37:00Z',
            } as UpdateCase,
            {
              lawsBroken:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
            } as UpdateCase,
            {
              custodyProvisions: [CaseCustodyProvisions._95_1_C],
            } as UpdateCase,
            { caseFacts: 'Lorem ipsum dolor sit amet,' } as UpdateCase,
            {
              legalArguments:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id_2`]}
          >
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await waitFor(
        () => screen.getByLabelText('Tímasetning *') as HTMLInputElement,
      ),
      '13:37',
    )
    userEvent.tab()
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText(
        'Lagaákvæði sem ætluð brot kærða þykja varða við *',
      ) as HTMLInputElement,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
    )
    userEvent.tab()
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.click(
      screen.getByRole('checkbox', { name: 'c-lið 1. mgr. 95. gr.' }),
    )
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
    userEvent.type(
      screen.getByLabelText('Málsatvik *') as HTMLInputElement,
      'Lorem ipsum dolor sit amet,',
    )
    userEvent.tab()
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
    userEvent.type(
      screen.getByLabelText('Lagarök *') as HTMLInputElement,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
    )
    userEvent.tab()
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
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={['/stofna-krofu/lagaakvaedi/test_id']}>
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
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

  test('should display the correct requestedCustodyEndTime from api', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    expect(
      (
        await waitFor(
          () => screen.getByLabelText('Tímasetning *') as HTMLInputElement,
        )
      ).value,
    ).toEqual('19:51')
  })
})
