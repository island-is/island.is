import { defineMessages } from 'react-intl'

export const confirmReadMessages = defineMessages({
  title: {
    id: 'fca.application:confirmRead.title',
    defaultMessage: 'Staðfesting á lestri upplýsinga',
    description: 'Confirm read section title',
  },
  description: {
    id: 'fca.application:confirmRead.description#markdown',
    defaultMessage:
      'Vinsamlegast kynntu þér [Persónuverndarstefnu HMS](https://island.is/s/hms/hms-personuverndarstefna) og efni á Ísland.is um [brunabótamat](https://island.is/brunabotamat) áður en lengra er haldið.',
    description: 'Confirm read section description',
  },
  confirmReadPrivacyPolicy: {
    id: 'fca.application:confirmRead.confirmReadPrivacyPolicy',
    defaultMessage: 'Ég hef kynnt mér Persónuverndarstefnu HMS',
    description: 'Confirm read section confirm read privacy policy',
  },
  confirmReadFireCompensationInfo: {
    id: 'fca.application:confirmRead.confirmReadFireCompensationInfo',
    defaultMessage:
      'Ég lýsi yfir að ég hef kynnt mér efni Ísland.is um brunabótamat',
    description: 'Confirm read section confirm read fire compensation info',
  },
})
