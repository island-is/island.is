import { defineMessages } from 'react-intl'

export const confirmReadMessages = defineMessages({
  title: {
    id: 'nhh.application:confirmRead.title',
    defaultMessage: 'Staðfesting á lestri upplýsinga',
    description: 'Confirm read section title',
  },
  description: {
    id: 'nhh.application:confirmRead.description#markdown',
    defaultMessage:
      'Vinsamlegast kynntu þér [Persónuverndarstefnu HMS](https://island.is/s/hms/hms-personuverndarstefna) áður en lengra er haldið.',
    description: 'Confirm read section description',
  },
  confirmReadPrivacyPolicy: {
    id: 'nhh.application:confirmRead.confirmReadPrivacyPolicy',
    defaultMessage: 'Ég hef kynnt mér Persónuverndarstefnu HMS',
    description: 'Confirm read section confirm read privacy policy',
  },
})
