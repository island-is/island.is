import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import StepTwo from './StepTwo'
import { MemoryRouter, Route } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { mockProsecutor } from '@island.is/judicial-system-web/src/utils/mocks'
import * as Constants from '../../../../utils/constants'

describe('Create detention request, step two', () => {
  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    // Mock call to api.updateCase
    fetchMock.mock('/api/case/test_id', 200, { method: 'put' })

    // Have requestedCourtDate in response from api because it's hard to use the datepicker with useEvents
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        requestedCustodyEndDate: '2020-10-15',
        custodyProvisions: null,
      },
      { method: 'get' },
    )

    const { getByTestId, getByText } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}>
          <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
            <StepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Act and Assert
    await act(async () => {
      await userEvent.type(
        await waitFor(
          () => getByTestId('requestedCustodyEndTime') as HTMLInputElement,
        ),
        '13:37',
      )

      userEvent.tab()

      expect(
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).toBeDisabled()

      await userEvent.type(
        getByTestId('lawsBroken') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
      )

      userEvent.tab()

      expect(
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).toBeDisabled()

      userEvent.click(getByText('c-lið 1. mgr. 95. gr.'))

      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('caseFacts') as HTMLInputElement,
        'Lorem ipsum dolor sit amet,',
      )

      userEvent.tab()

      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('legalArguments') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
      )

      userEvent.tab()

      expect(
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).not.toBeDisabled()
    })
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus est, si videtur, et recta quidem ad me. Negat enim summo bono afferre incrementum diem. Quo plebiscito decreta a senatu est consuli quaestio Cn. Iam quae corporis sunt, ea nec auctoritatem cum animi partibus, comparandam et cognitionem habent faciliorem. Sin kakan malitiam dixisses, ad aliud nos unum certum vitium consuetudo Latina traduceret. Comprehensum, quod cognitum non habet? Duo Reges: constructio interrete. Neque enim civitas in seditione beata esse potest nec in discordia dominorum domus; At modo dixeras nihil in istis rebus esse, quod interesset. Cur tantas regiones barbarorum pedibus obiit, tot maria transmisit? Quod totum contra est. Quid, si etiam iucunda memoria est praeteritorum malorum?',
        custodyProvisions: [CaseCustodyProvisions._95_1_C],
        caseFacts:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quod non faceret, si in voluptate summum bonum poneret. Nam Pyrrho, Aristo, Erillus iam diu abiecti. Iam id ipsum absurdum, maximum malum neglegi. Magni enim aestimabat pecuniam non modo non contra leges, sed etiam legibus partam. Levatio igitur vitiorum magna fit in iis, qui habent ad virtutem progressionis aliquantum. Duo Reges: constructio interrete. Iam in altera philosophiae parte. Sed ego in hoc resisto; Quid, quod res alia tota est? Nihil acciderat ei, quod nollet, nisi quod anulum, quo delectabatur, in mari abiecerat.',
        legalArguments:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quod non faceret, si in voluptate summum bonum poneret. Nam Pyrrho, Aristo, Erillus iam diu abiecti. Iam id ipsum absurdum, maximum malum neglegi. Magni enim aestimabat pecuniam non modo non contra leges, sed etiam legibus partam. Levatio igitur vitiorum magna fit in iis, qui habent ad virtutem progressionis aliquantum. Duo Reges: constructio interrete. Iam in altera philosophiae parte. Sed ego in hoc resisto; Quid, quod res alia tota est? Nihil acciderat ei, quod nollet, nisi quod anulum, quo delectabatur, in mari abiecerat.',
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={['/stofna-krofu/lagaakvaedi/test_id']}>
          <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
            <StepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(
      await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
    ).not.toBeDisabled()
  })

  test('should display the correct requestedCustodyEndTime from api', async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}>
          <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
            <StepTwo />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(
      (
        await waitFor(
          () => getByTestId('requestedCustodyEndTime') as HTMLInputElement,
        )
      ).value,
    ).toEqual('19:51')
  })
})
