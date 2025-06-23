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
            message: 'Það er of lítið eftir af mánuðinum til að geta sótt um. Vinsamlegast reynið aftur 1. í næsta mánuði.',
          }),
        ],
      }),
    ],
  })