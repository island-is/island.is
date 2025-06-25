import { buildAlertMessageField, buildMultiField, buildSection } from "@island.is/application/core";

export const endOfMonthCheck = buildSection({
    id: 'endOfMonthCheck',
    children: [
      buildMultiField({
        id: 'endOfMonthCheckMultiField',
        title: 'Of nálægt lok mánaðar',
        children: [
          buildAlertMessageField({
            id: 'endOfMonthCheckAlertMessage',
            alertType: 'warning',
            message: 'Það er of lítið eftir af mánuðinum til að hægt sé að sækja um. Vinsamlegast reynið aftur eftir mánaðamót.',
          }),
        ],
      }),
    ],
  })
  