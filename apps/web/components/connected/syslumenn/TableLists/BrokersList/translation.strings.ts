import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  errorTitle: {
    id: 'web.syslumenn.brokersList:errorTitle',
    defaultMessage: 'Villa',
    description:
      'Villa (titill á villuskilaboðum ef ekki tókst að sækja lista yfir verðbréfamiðlara)',
  },
  errorMessage: {
    id: 'web.syslumenn.brokersList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja lista yfir verðbréfamiðlara.',
    description:
      'Ekki tókst að sækja lista yfir verðbréfamiðlara (villutexti ef ekki tókst að sækja lista yfir verðbréfamiðlara)',
  },
  searchPlaceholder: {
    id: 'web.syslumenn.brokersList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Placeholder texti fyrir leitarbox',
  },
  noBrokersFound: {
    id: 'web.syslumenn.brokersList:noBrokersFound',
    defaultMessage: 'Engir verðbréfamiðlarar fundust.',
    description: 'Texti sem birtist ef engir verðbréfamiðlarar fundust.',
  },
  name: {
    id: 'web.syslumenn.brokersList:name',
    defaultMessage: 'Nafn',
    description: 'Nafn (texti á dálk í töflu)',
  },
  nationalId: {
    id: 'web.syslumenn.brokersList:nationalId',
    defaultMessage: 'Kennitala',
    description: 'Kennitala (texti á dálk í töflu)',
  },
})
