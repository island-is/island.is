import { defineMessages } from 'react-intl'

export const receptionAndAssignment = defineMessages({
  title: {
    id: 'judicial.system.core:reception_and_assignment.title',
    defaultMessage: 'Móttaka og úthlutun',
    description:
      'Notaður sem titill á Móttaka og úthlutun skrefi í öllum málategundum.',
  },
  defendantPleaAlertTitle: {
    id: 'judicial.system.core:reception_and_assignment.defendant_plea_alert_title',
    defaultMessage:
      'Afstaða {defendantCount, plural, one {sakbornings} other {sakborninga}} til sakarefnis í skýrslutöku hjá lögreglu',
    description:
      'Notaður sem titill fyrir Afstaða sakbornings í Móttaka og úthlutun skrefi í öllum málategundum.',
  },
  defendantPleaAlertMessage: {
    id: 'judicial.system.core:reception_and_assignment.defendant_plea_alert_message',
    defaultMessage:
      '{defendantGender, select, MALE {Ákærði} other {Ákærða}} {nameAndPlea}',
    description:
      'Notaður sem texti fyrir Afstaða sakbornings í Móttaka og úthlutun skrefi í öllum málategundum.',
  },
})
