import { FormValue } from '@island.is/application/types'
import { hasReceivedConfirmation } from './hasReceivedConfirmation'
import { WhoIsTheNotificationForEnum } from '../types'
describe('hasReceivedConfirmation', () => {
  const confirmedJuridicial: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
    accidentStatus: {
      receivedConfirmations: {
        InjuredOrRepresentativeParty: true,
      },
    },
  }

  const confirmedMe: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
    accidentStatus: {
      receivedConfirmations: {
        CompanyParty: true,
      },
    },
  }

  const notConfirmed: FormValue = {
    accidentStatus: {
      receivedConfirmations: false,
    },
  }

  it.each([
    { for: 'juridical person', input: confirmedJuridicial, expected: true },
    { for: 'company', input: confirmedMe, expected: true },
    { for: 'not confirmed', input: notConfirmed, expected: false },
  ])(
    'should return $expected when confirmation is $for',
    ({ input, expected }) => {
      expect(hasReceivedConfirmation(input)).toEqual(expected)
    },
  )
})
