import { defineMessages } from 'react-intl'

export const vacationErrors = defineMessages({
  invalidValue: {
    id: 'vmst.ub.application:vacationErrors.invalidValue',
    defaultMessage: 'Vinsamlegast athugið',
    description: 'Invalid value error message',
  },
  invalidVacation: {
    id: 'vmst.ub.application:paymentErrors.invalidVacation',
    defaultMessage:
      'Ekki tókst að staðfesta Orlof. Vinsamlegast athugaðu að það sé rétt slegið inn.',
    description: 'Message for invalid vacation',
  },
})
