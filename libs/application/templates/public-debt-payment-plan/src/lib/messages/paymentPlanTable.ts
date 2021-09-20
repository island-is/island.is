import { defineMessages } from 'react-intl'

export const paymentPlanTable = {
  table: {
    head: defineMessages({
      dueDate: {
        id: `pdpp.application:paymentPlanTable.table.head.dueDate`,
        defaultMessage: 'Gjalddagi',
        description: 'Payment plan table due date',
      },
      remaining: {
        id: `pdpp.application:paymentPlanTable.table.head.remaining`,
        defaultMessage: `Eftirstöðvar`,
        description: 'Payment plan table remaining amount',
      },
      payment: {
        id: `pdpp.application:paymentPlanTable.table.head.payment`,
        defaultMessage: 'Innborgun',
        description: 'Payment plan table payment amount',
      },
      totalPayment: {
        id: `pdpp.application:paymentPlanTable.table.head.totalPayment`,
        defaultMessage: 'Innborgun alls',
        description: 'Payment plan table totalPayment amount',
      },
      wageDeduction: {
        id: `pdpp.application:paymentPlanTable.table.head.wageDeduction`,
        defaultMessage: 'Launaafdráttur',
        description: 'Payment plan table wage deduction amount',
      },
      totalWageDeduction: {
        id: `pdpp.application:paymentPlanTable.table.head.totalWageDeduction`,
        defaultMessage: 'Launaafdráttur alls',
        description: 'Payment plan table total wage deduction amount',
      },
    }),
    labels: defineMessages({
      seeAllDates: {
        id: `pdpp.application:paymentPlanTable.table.labels.seeAllDates`,
        defaultMessage: `Sjá alla gjalddaga`,
        description: 'See all dates',
      },
      seeLessDates: {
        id: `pdpp.application:paymentPlanTable.table.labels.seeLessDates`,
        defaultMessage: `Sjá minna`,
        description: 'See less dates',
      },
      totalAmount: {
        id: `pdpp.application:paymentPlanTable.table.labels.totalAmount`,
        defaultMessage: `Heildarupphæð`,
        description: 'Total amount',
      },
    }),
  },
}
