import { defineMessages } from 'react-intl'
import { NAMESPACE } from './constants'

export const m = defineMessages({
  yes: {
    id: `${NAMESPACE}:yes`,
    defaultMessage: 'Já',
  },
  no: {
    id: `${NAMESPACE}:no`,
    defaultMessage: 'Nei',
  },
  questionnaireWithoutTitle: {
    id: `${NAMESPACE}:questionnaireWithoutTitle`,
    defaultMessage: 'Ónefndur spurningalisti',
  },
  noLabel: {
    id: `${NAMESPACE}:noLabel`,
    defaultMessage: 'Enginn titill',
  },
})
