import { defineMessages } from 'react-intl'

export const extraInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:extraInformation.general.sectionTitle',
      defaultMessage: 'Viðbótaupplýsingar',
      description: 'Title of extra information section',
    },
    pageTitle: {
      id: 'ss.application:extraInformation.general.pageTitle',
      defaultMessage: 'Viðbótaupplýsingar',
      description: 'Title of extra information page',
    },
    description: {
      id: 'ss.application:extraInformation.general.description',
      defaultMessage:
        'Vinsamlegast veldu taktu fram ef það eru einhverjar sérþarfir. Ef ekkert á við þá heldurðu bara áfram.',
      description: 'Description of extra information page',
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
  disability: defineMessages({
    subtitle: {
      id: 'ss.application:extraInformation.disabilites.subtitle',
      defaultMessage: 'Fatlanir',
      description: 'Disabilites sub title',
    },
    checkboxLabel: {
      id: 'ss.application:extraInformation.disabilites.checkboxLabel',
      defaultMessage: 'Fötlunargreining liggur fyrir',
      description: 'Disabilites checkbox label',
    },
    textareaLabel: {
      id: 'ss.application:extraInformation.disabilites.textareaLabel',
      defaultMessage: 'Fötlun',
      description: 'Disabilites textarea label',
    },
    textareaPlaceholder: {
      id: 'ss.application:extraInformation.disabilites.textareaPlaceholder',
      defaultMessage:
        'Vinsamlegast skrifið stutta lýsingu á fötlun og þörf fyrir helstu þjónustu',
      description: 'Disabilites textarea placeholder',
    },
  }),
  other: defineMessages({
    subtitle: {
      id: 'ss.application:extraInformation.other.subtitle',
      defaultMessage: 'Aðrar upplýsingar sem nemandi vill koma á framfæri',
      description: 'Other sub title',
    },
    textareaLabel: {
      id: 'ss.application:extraInformation.other.textareaLabel',
      defaultMessage: 'Annað',
      description: 'Other textarea label',
    },
    textareaPlaceholder: {
      id: 'ss.application:extraInformation.other.textareaPlaceholder',
      defaultMessage: 'Placeholder ef það þarf',
      description: 'Other textarea placeholder',
    },
  }),
}
