import { defineMessages } from 'react-intl'

export const bankInfoForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.bankInfoForm.general.sectionTitle',
      defaultMessage: 'Bankaupplýsingar',
      description: 'Bank info form section title',
    },
    pageTitle: {
      id: 'fa.application:section.bankInfoForm.general.pageTitle',
      defaultMessage: 'Greiðsla fjárhagsaðstoðar',
      description: 'Bank info form page title',
    },
    info: {
      id: 'fa.application:section.bankInfoForm.general.info',
      defaultMessage:
        'Til að geta afgreitt umsóknina þurfum við að fá uppgefinn bankareikning í þínu nafni.',
      description: 'Bank info form infomation',
    },
    descriptionTitle: {
      id: 'fa.application:section.bankInfoForm.general.descriptionTitle',
      defaultMessage: 'Nánar um bankaupplýsingar',
      description: 'Bank info description title',
    },
    description: {
      id: 'fa.application:section.bankInfoForm.general.description#markdown',
      defaultMessage:
        '#####Þér er ekki skylt að gefa upp bankaupplýsingar hér. Ef þú gefur bankaupplýsingarnar upp verða þær geymdar í gagnagrunni fjárhagsaðstoðar sveitarfélaganna. Kjósirðu að gefa þær ekki upp núna verður hringt í þig og óskað eftir þeim ef umsóknin verður samþykkt.',
      description: 'Bank info description',
    },
  }),
  inputsLabels: defineMessages({
    bankNumber: {
      id: 'fa.application:section.bankInfoForm.inputsLabels.bankNumber',
      defaultMessage: 'Bankaupplýsingar',
      description: 'Bank info form input label for bank number',
    },
    ledger: {
      id: 'fa.application:section.bankInfoForm.inputsLabels.ledger',
      defaultMessage: 'Höfuðbók',
      description: 'Bank info form input label for ledger',
    },
    accountNumber: {
      id: 'fa.application:section.bankInfoForm.inputsLabels.accountNumber',
      defaultMessage: 'Bankanúmer',
      description: 'Bank info form input label for account number',
    },
  }),
  inputsPlaceholders: defineMessages({
    bankNumber: {
      id: 'fa.application:section.bankInfoForm.inputsPlaceholders.bankNumber',
      defaultMessage: '0000',
      description: 'Placeholder for bank number input',
    },
    ledger: {
      id: 'fa.application:section.bankInfoForm.inputsPlaceholders.ledger',
      defaultMessage: '00',
      description: 'Placeholder for ledger input',
    },
    accountNumber: {
      id: 'fa.application:section.bankInfoForm.inputsPlaceholders.accountNumber',
      defaultMessage: '000000',
      description: 'Placeholder for account number input',
    },
  }),
}
