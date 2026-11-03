import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsluyfirlit',
      description: 'Title of payment section',
    },
  }),
  description: defineMessages({
    title: {
      id: 'pd.application:payment.description.title',
      defaultMessage: 'Greiðsluyfirlit',
      description: 'Title of payment description field',
    },
  }),
  summary: defineMessages({
    forPaymentLabel: {
      id: 'pd.application:payment.summary.forPaymentLabel',
      defaultMessage: 'Greiðsluliðir',
      description: 'Heading shown above the list of selected debts',
    },
    totalLabel: {
      id: 'pd.application:payment.summary.totalLabel',
      defaultMessage: 'Samtals til greiðslu',
      description:
        'Label for the total amount to be paid for the selected debts',
    },
    remainingLabel: {
      id: 'pd.application:payment.summary.remainingLabel',
      defaultMessage: 'Eftirstöðvar skuldar',
      description: 'Label for the remaining amount of the selected debts',
    },
  }),
  noSelection: defineMessages({
    title: {
      id: 'pd.application:payment.noSelection.title',
      defaultMessage: 'Engar skuldir valdar',
      description:
        'Title shown when none of the selected debts are in the current list',
    },
    message: {
      id: 'pd.application:payment.noSelection.message',
      defaultMessage:
        'Skuldastaða þín hefur breyst síðan þú valdir. Farðu til baka og veldu skuldir að nýju.',
      description:
        'Message shown when none of the selected debts are in the current list',
    },
  }),
  unavailable: defineMessages({
    title: {
      id: 'pd.application:payment.unavailable.title',
      defaultMessage: 'Ekki tókst að stofna greiðslu',
      description:
        'Title shown when the debt payment could not be created because FJS could not check the debts',
    },
    message: {
      id: 'pd.application:payment.unavailable.message',
      defaultMessage:
        'Fjársýsla ríkisins svarar ekki eða önnur greiðsla vegna sömu skulda er í vinnslu. Reyndu aftur síðar.',
      description:
        'Message shown when the debt payment could not be created because FJS could not check the debts',
    },
  }),
  alreadyPaid: defineMessages({
    title: {
      id: 'pd.application:payment.alreadyPaid.title',
      defaultMessage: 'Greiðslan hefur þegar borist',
      description:
        'Title shown when the user goes back from a payment that is already paid',
    },
    message: {
      id: 'pd.application:payment.alreadyPaid.message',
      defaultMessage:
        'Ekki er hægt að fara til baka eftir greiðslu. Endurhladdu síðuna til að halda áfram.',
      description:
        'Message shown when the user goes back from a payment that is already paid',
    },
  }),
  buttons: defineMessages({
    submit: {
      id: 'pd.application:payment.buttons.submit',
      defaultMessage: 'Greiða skuld',
      description: 'Submit application button',
    },
  }),
}
