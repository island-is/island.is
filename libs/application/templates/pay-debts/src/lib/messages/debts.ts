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
  fetch: defineMessages({
    errorTitle: {
      id: 'pd.application:debts.fetch.errorTitle',
      defaultMessage: 'Ekki náðist að sækja skuldastöðu',
      description: 'Title shown when fetching the debts failed',
    },
    errorMessage: {
      id: 'pd.application:debts.fetch.errorMessage',
      defaultMessage: 'Reyndu aftur eða komdu aftur síðar.',
      description: 'Message shown when fetching the debts failed',
    },
    retryButton: {
      id: 'pd.application:debts.fetch.retryButton',
      defaultMessage: 'Reyna aftur',
      description: 'Label of the button that retries fetching the debts',
    },
    refreshedTitle: {
      id: 'pd.application:debts.fetch.refreshedTitle',
      defaultMessage: 'Skuldastaðan var uppfærð',
      description:
        'Title shown when a refresh returned a different list of debts and the selection was cleared',
    },
    refreshedMessage: {
      id: 'pd.application:debts.fetch.refreshedMessage',
      defaultMessage:
        'Skuldastaða þín hefur breyst síðan þú valdir síðast. Veldu að nýju áður en þú heldur áfram.',
      description:
        'Message shown when a refresh returned a different list of debts and the selection was cleared',
    },
  }),
  table: defineMessages({
    chargeTypeNameHeader: {
      id: 'pd.application:debts.table.chargeTypeNameHeader',
      defaultMessage: 'Gjaldflokkur',
      description: 'Charge type table header',
    },
    chargeItemSubjectHeader: {
      id: 'pd.application:debts.table.chargeItemSubjectHeader',
      defaultMessage: 'Gjaldgrunnur',
      description: 'Charge item subject table header',
    },
    timePeriodHeader: {
      id: 'pd.application:debts.table.timePeriodHeader',
      defaultMessage: 'Tímabil',
      description: 'Time period table header',
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
      defaultMessage: 'Samtals til greiðslu',
      description:
        'Label for total amount selected to pay, shown in the sticky footer',
    },
    totalLeftLabel: {
      id: 'pd.application:debts.table.totalLeftLabel',
      defaultMessage: 'Eftirstöðvar skuldar',
      description:
        'Label for remaining debt amount after payment, shown in the sticky footer',
    },
  }),
}
