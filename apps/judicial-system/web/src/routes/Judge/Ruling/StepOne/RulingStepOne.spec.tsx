import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import {
  CaseCustodyRestrictions,
  CaseDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { RulingStepOne } from './RulingStepOne'

describe('/domari-krafa/urskurdur', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

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
            {
              id: 'test_id_3',
              custodyEndDate: '2020-10-24T12:31:00Z',
            } as UpdateCase,
            {
              id: 'test_id_3',
              decision: CaseDecision.ACCEPTING,
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepOne />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.type(
      await screen.findByLabelText('Efni úrskurðar *'),
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Krafa um gæsluvarðhald samþykkt',
      }),
    )

    userEvent.type(
      await screen.findByLabelText('Tímasetning (kk:mm) *'),
      '12:31',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button by default if case data is valid', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    /**
     * TODO: Use test mock with custodyEndDate: null to make sure it's being autofilled with
     * requestedCustodyEndDate
     */
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
        <UserProvider>
          <RulingStepOne />
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

  test('should not display the isolation checkbox if the case decision is REJECTING', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id',
              decision: CaseDecision.REJECTING,
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepOne />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Kröfu um gæsluvarðhald hafnað',
      }),
    )
    // Assert
    expect(
      await waitFor(() =>
        screen.queryByRole('checkbox', {
          name: 'Kærði skal sæta einangrun',
        }),
      ),
    ).not.toBeInTheDocument()
  })

  test('should not display the isolation checkbox if the case decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id',
              decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <RulingStepOne />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(
      await screen.findByRole('radio', {
        name: 'Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann',
      }),
    )
    // Assert
    expect(
      await waitFor(() =>
        screen.queryByRole('checkbox', {
          name: 'Kærði skal sæta einangrun',
        }),
      ),
    ).not.toBeInTheDocument()
  })
})
