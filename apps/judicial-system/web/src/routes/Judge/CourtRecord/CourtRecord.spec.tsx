import React from 'react'
import { render, waitFor, screen, act } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import CourtRecord from './CourtRecord'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UpdateCase } from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import { parseTime } from '@island.is/judicial-system-web/src/utils/formatters'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'

describe('/domari-krafa/thingbok', () => {
  test('should not allow users to continue unless every required field has been filled outt', async () => {
    // Arrange
    await act(async () => {
      render(
        <MockedProvider
          mocks={[
            ...mockCaseQueries,
            ...mockJudgeQuery,
            ...mockUpdateCaseMutation([
              {
                courtStartTime: parseTime(formatISO(new Date()), '12:31'),
              } as UpdateCase,
              {
                courtEndTime: parseTime(formatISO(new Date()), '12:32'),
              } as UpdateCase,
              {
                courtAttendees:
                  'Ruth Bader Ginsburg saksóknari\nJon Harring kærði\nSaul Goodman skipaður verjandi kærða',
              } as UpdateCase,
              {
                policeDemands:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Duo Reges: constructio interrete. Nam his libris eum malo quam reliquo ornatu villae delectari. Quod cum dixissent, ille contra. At enim hic etiam dolore. Vide ne ista sint Manliana vestra aut maiora etiam, si imperes quod facere non possim. Ita ne hoc quidem modo paria peccata sunt. Non autem hoc: igitur ne illud quidem. Quare conare, quaeso. Nam si propter voluptatem, quae est ista laus, quae possit e macello peti?',
              } as UpdateCase,
              {
                accusedPlea:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
              } as UpdateCase,
              {
                litigationPresentations:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nihilne est in his rebus, quod dignum libero aut indignum esse ducamus? Haec quo modo conveniant, non sane intellego. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Etenim semper illud extra est, quod arte comprehenditur. Paulum, cum regem Persem captum adduceret, eodem flumine invectio? Nunc haec primum fortasse audientis servire debemus. Duo Reges: constructio interrete. Quare hoc videndum est, possitne nobis hoc ratio philosophorum dare.',
              } as UpdateCase,
            ]),
          ]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.COURT_RECORD_ROUTE}/test_id_2`]}
          >
            <UserProvider>
              <Route path={`${Constants.COURT_RECORD_ROUTE}/:id`}>
                <CourtRecord />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      // Act
      userEvent.type(await screen.findByLabelText('Þinghald hófst *'), '12:31')

      expect(document.title).toEqual('Þingbók - Réttarvörslugátt')

      expect(
        (screen.getByLabelText(
          'Viðstaddir og hlutverk þeirra *',
        ) as HTMLInputElement).value,
      ).toEqual(
        'Ruth Bader Ginsburg saksóknari\nJon Harring kærði\nSaul Goodman skipaður verjandi kærða',
      )

      expect(
        screen.getByRole('button', {
          name: /Halda áfram/i,
        }) as HTMLButtonElement,
      ).toBeDisabled()

      userEvent.type(
        screen.getByLabelText('Krafa lögreglu *'),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Duo Reges: constructio interrete. Nam his libris eum malo quam reliquo ornatu villae delectari. Quod cum dixissent, ille contra. At enim hic etiam dolore. Vide ne ista sint Manliana vestra aut maiora etiam, si imperes quod facere non possim. Ita ne hoc quidem modo paria peccata sunt. Non autem hoc: igitur ne illud quidem. Quare conare, quaeso. Nam si propter voluptatem, quae est ista laus, quae possit e macello peti?',
      )

      expect(
        screen.getByRole('button', {
          name: /Halda áfram/i,
        }) as HTMLButtonElement,
      ).toBeDisabled()

      userEvent.type(
        screen.getByLabelText('Afstaða kærða *'),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
      )

      expect(
        screen.getByRole('button', {
          name: /Halda áfram/i,
        }) as HTMLButtonElement,
      ).toBeDisabled()

      userEvent.type(
        screen.getByLabelText(
          'Málflutningur og aðrar bókanir *',
        ) as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nihilne est in his rebus, quod dignum libero aut indignum esse ducamus? Haec quo modo conveniant, non sane intellego. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Etenim semper illud extra est, quod arte comprehenditur. Paulum, cum regem Persem captum adduceret, eodem flumine invectio? Nunc haec primum fortasse audientis servire debemus. Duo Reges: constructio interrete. Quare hoc videndum est, possitne nobis hoc ratio philosophorum dare.',
      )

      // Assert
      expect(
        screen.getByRole('button', {
          name: /Halda áfram/i,
        }) as HTMLButtonElement,
      ).not.toBeDisabled()
    })
  })
})
