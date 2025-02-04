import { defineMessages } from 'react-intl'

export const extraInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:extraInformation.general.sectionTitle',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Title of extra information section',
    },
    pageTitle: {
      id: 'ss.application:extraInformation.general.pageTitle',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Title of extra information page',
    },
  }),
  nativeLanguage: defineMessages({
    subtitle: {
      id: 'ss.application:extraInformation.nativeLanguage.subtitle',
      defaultMessage: 'Móðurmál (ef annað en íslenska)',
      description: 'Native language sub title',
    },
    selectLabel: {
      id: 'ss.application:extraInformation.nativeLanguage.selectLabel',
      defaultMessage: 'Móðurmál',
      description: 'Native language select label',
    },
    selectPlaceholder: {
      id: 'ss.application:extraInformation.nativeLanguage.selectPlaceholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Native language select placeholder',
    },
  }),
  other: defineMessages({
    subtitle: {
      id: 'ss.application:extraInformation.other.subtitle',
      defaultMessage: 'Aðrar upplýsingar sem umsækjandi vill koma á framfæri',
      description: 'Other sub title',
    },
    description: {
      id: 'ss.application:extraInformation.other.description',
      defaultMessage:
        'Hérna er hægt að tilgreina upplýsingar sem þú telur mikilvægt að koma á framfæri, s.s. ef fötlunargreining liggur fyrir eða aðrar upplýsingar sem þú telur nauðsynlegt að skólinn búi yfir.',
      description: 'Other description',
    },
    textareaLabel: {
      id: 'ss.application:extraInformation.other.textareaLabel',
      defaultMessage: 'Annað',
      description: 'Other textarea label',
    },
    textareaPlaceholder: {
      id: 'ss.application:extraInformation.other.textareaPlaceholder',
      defaultMessage: ' ',
      description: 'Other textarea placeholder',
    },
  }),
  supportingDocuments: defineMessages({
    subtitle: {
      id: 'ss.application:extraInformation.supportingDocuments.subtitle',
      defaultMessage: 'Fylgigögn',
      description: 'Supporting documents sub title',
    },
    description: {
      id: 'ss.application:extraInformation.supportingDocuments.description',
      defaultMessage:
        'Hér getur þú hlaðið inn gögnum sem þú telur mikilvægt að fylgi umsókninni og styðji við hana. Athugið að ekki er nauðsynlegt að láta nein viðbótargögn fylgja umsókn.',
      description: 'Supporting documents description',
    },
    fileUploadHeader: {
      id: 'ss.application:extraInformation.supportingDocuments.fileUploadHeader',
      defaultMessage: 'Viðhengi',
      description: 'Supporting documents file upload title',
    },
    fileUploadDescription: {
      id: 'ss.application:extraInformation.supportingDocuments.fileUploadDescription',
      defaultMessage:
        'Eingöngu er tekið við skjölum með endingunum: .pdf, .jpg, .jpeg, .png',
      description: 'Supporting documents file upload title',
    },
    fileUploadButtonLabel: {
      id: 'ss.application:extraInformation.supportingDocuments.fileUploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Supporting documents file upload title',
    },
  }),
}
