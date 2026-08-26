import { defineMessages } from 'react-intl'

export const debts = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:debts.general.sectionTitle',
      defaultMessage: 'Skuldastaða',
      description: 'Title of first section',
    },
  }),
  description: defineMessages({
    title: {
      id: 'pd.application:debts.description.title',
      defaultMessage: 'Skuldastaða',
      description: 'Title of description field',
    },
    description: {
      id: 'pd.application:debts.description.description',
      defaultMessage:
        'Yfirlit þeirra skulda sem hægt er að greiða til ríkisins. Nánara yfirlit og sundurliðun skulda er undir Fjármál á Mínum Síðum.',
      description: 'Description of description field',
    },
  }),
  table: defineMessages({
    chargeTypeNameHeader: {
      id: 'pd.application:debts.table.chargeTypeNameHeader',
      defaultMessage: 'Gjaldflokkur',
      description: 'Charge type table header',
    },
    dueDateHeader: {
      id: 'pd.application:debts.table.dueDateHeader',
      defaultMessage: 'Gjalddagi',
      description: 'Due date table header',
    },
    finalDueDateHeader: {
      id: 'pd.application:debts.table.finalDueDateHeader',
      defaultMessage: 'Eindagi',
      description: 'Final due date table header',
    },
    amountHeader: {
      id: 'pd.application:debts.table.amountHeader',
      defaultMessage: 'Skuldastaða',
      description: 'Debt amount table header',
    },
    emptyMessage: {
      id: 'pd.application:debts.table.emptyMessage',
      defaultMessage: 'Engar skuldir fundust',
      description: 'Message shown when there are no debts',
    },
    toPayLabel: {
      id: 'pd.application:debts.table.toPayLabel',
      defaultMessage: 'Til greiðslu',
      description: 'Label for total amount to pay',
    },
    totalDebtsLabel: {
      id: 'pd.application:debts.table.totalDebtsLabel',
      defaultMessage: 'Heildarskuld',
      description: 'Label for the total debts footer row',
    },
    totalToPayLabel: {
      id: 'pd.application:debts.table.totalToPayLabel',
      defaultMessage: 'Til greiðslu',
      description:
        'Label for total amount selected to pay, shown in the sticky footer',
    },
    totalLeftLabel: {
      id: 'pd.application:debts.table.totalLeftLabel',
      defaultMessage: 'Eftirstöðvar',
      description:
        'Label for remaining debt amount after payment, shown in the sticky footer',
    },
  }),
}
