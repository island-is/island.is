import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import {
  AccusedPleaDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import { parseTime } from '@island.is/judicial-system-web/src/utils/formatters'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import CourtRecord from './CourtRecord'

describe('/domari-krafa/thingbok', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_9' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id_9',
              courtStartTime: parseTime(formatISO(new Date()), '12:31'),
            } as UpdateCase,
            {
              id: 'test_id_9',
              courtEndTime: parseTime(formatISO(new Date()), '12:32'),
            } as UpdateCase,
            {
              id: 'test_id_9',
              courtAttendees:
                'Ruth Bader Ginsburg saksóknari\nJon Harring kærði\nSaul Goodman skipaður verjandi kærða',
            } as UpdateCase,
            {
              id: 'test_id_9',
              policeDemands:
                'Þess er krafist að Jon Harring, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði string, til miðvikudagsins 16. september 2020, kl. 00:00.',
            } as UpdateCase,
            {
              id: 'test_id_9',
              policeDemands:
                'Þess er krafist að Jon Harring, kt. 111111-1110, sæti gæsluvarðhaldi með úrskurði string, til miðvikudagsins 16. september 2020, kl. 00:00.',
            } as UpdateCase,
            {
              id: 'test_id_9',
              accusedPleaDecision: AccusedPleaDecision.ACCEPT,
            } as UpdateCase,
            {
              id: 'test_id_9',
              accusedPleaAnnouncement:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
            } as UpdateCase,
            {
              id: 'test_id_9',
              litigationPresentations:
                'Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi kærða ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að kærða verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að kærða verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <CourtRecord />
        </UserProvider>
      </MockedProvider>,
    )

    // Act
    userEvent.type(
      await screen.findByLabelText('Þinghald hófst (kk:mm) *'),
      '12:31',
    )

    expect(document.title).toEqual('Þingbók - Réttarvörslugátt')

    expect(
      ((await screen.findByLabelText(
        'Viðstaddir og hlutverk þeirra *',
      )) as HTMLInputElement).value,
    ).toEqual(
      'Ruth Bader Ginsburg saksóknari\nJon Harring kærði\nSaul Goodman skipaður verjandi kærða',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()

    userEvent.click(
      await screen.findByRole('radio', { name: 'Kærði samþykkir kröfuna' }),
    )

    userEvent.type(
      await screen.findByLabelText('Afstaða kærða'),
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })
})
