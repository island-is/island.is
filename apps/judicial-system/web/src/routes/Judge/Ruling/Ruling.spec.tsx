import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import { RulingStepOne, RulingStepTwo } from './'
import * as Constants from '../../../utils/constants'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import fetchMock from 'fetch-mock'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'

describe('Ruling routes', () => {
  beforeEach(() => {
    fetchMock.mock('/api/case/test_id', 200, {
      method: 'put',
      overwriteRoutes: true,
    })
  })

  describe(Constants.RULING_STEP_ONE_ROUTE, () => {
    test('should now allow users to continue unless every required field has been filled out', async () => {
      // Arrange
      fetchMock.mock(
        '/api/case/test_id',
        {
          id: 'test_id',
          custodyEndDate: '2020-10-24',
        },
        { method: 'get' },
      )

      // Act and Assert
      const { getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <MemoryRouter
            initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
              <RulingStepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>,
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
      fetchMock.mock(
        '/api/case/test_id',
        {
          id: 'test_id',
          ruling:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui autem de summo bono dissentit de tota philosophiae ratione dissentit. Sed est forma eius disciplinae, sicut fere ceterarum, triplex: una pars est naturae, disserendi altera, vivendi tertia. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Tu enim ista lenius, hic Stoicorum more nos vexat. Si est nihil nisi corpus, summa erunt illa: valitudo, vacuitas doloris, pulchritudo, cetera. Prodest, inquit, mihi eo esse animo. Quonam modo? Duo Reges: constructio interrete.',
          custodyEndDate: '2020-09-16T19:51:39.466Z',
        },
        { method: 'get', overwriteRoutes: true },
      )

      // Act
      const { getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <MemoryRouter
            initialEntries={[`${Constants.RULING_STEP_ONE_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
              <RulingStepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>,
      )

      // Assert
      expect(
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).not.toBeDisabled()
    })
  })

  describe(Constants.RULING_STEP_TWO_ROUTE, () => {
    test('should now allow users to continue unless every required field has been filled out', async () => {
      // Arrange
      fetchMock.mock(
        '/api/case/test_id',
        {
          id: 'test_id',
          accusedAppealDecision: null,
          prosecutorAppealDecision: null,
        },
        { method: 'get', overwriteRoutes: true },
      )

      // Act and Assert
      const { getByLabelText, getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <MemoryRouter
            initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
              <RulingStepTwo />
            </Route>
          </MemoryRouter>
        </userContext.Provider>,
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
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        accusedAppealDecision: null,
        prosecutorAppealDecision: null,
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getAllByRole } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
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
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        accusedAppealDecision: CaseAppealDecision.ACCEPT,
        prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getByText, getByTestId } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
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
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        accusedAppealDecision: CaseAppealDecision.APPEAL,
        prosecutorAppealDecision: CaseAppealDecision.APPEAL,
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getByText, getByTestId } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <MemoryRouter
          initialEntries={[`${Constants.RULING_STEP_TWO_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
            <RulingStepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
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
