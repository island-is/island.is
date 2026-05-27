import { defineMessages } from 'react-intl'

export const conclusion = defineMessages({
  multiFieldTitle: {
    id: 'vmst.cjs.application:conclusion.multiFieldTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title for the multi field on completed form',
  },
  completedFormAlertTitle: {
    id: 'vmst.cjs.application:conclusion.completedFormAlertTitle',
    defaultMessage:
      'Vinnumálastofnun hefur móttekið staðfestingu þína á atvinnuleit.',
    description: 'completed form alert title',
  },
  completedFormDescriptionFieldTitle: {
    id: 'vmst.cjs.application:conclusion.completedFormDescriptionFieldTitle',
    defaultMessage: 'Er eitthvað óljóst?',
    description: 'completed form alert description',
  },
  expandableHeader: {
    id: 'vmst.cjs.application:conclusion.expandableHeader',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Header for the expandable accordion section',
  },
  expandableIntro: {
    id: 'vmst.cjs.application:conclusion.expandableIntro#markdown',
    defaultMessage:
      '- Þú þarft næst að staðfesta atvinnuleit á tímabilinu {period}.\n- Mikilvægt er að halda atvinnuleitinni gangandi',
    description:
      'Intro text for the expandable accordion section (markdown). {period} is replaced with the next confirmation date range, e.g. "20. - 25. mars"',
  },
  descriptionFieldDescription: {
    id: 'vmst.cjs.application:conclusion.descriptionFieldDescription#markdown',
    defaultMessage:
      'Skoðaðu nánari upplýsingar á [upplýsingasíðu Vinnumálastofnunar](https://www.vinnumalastofnun.is)',
    description:
      'Description field text with a link to the Directorate of Labour info page',
  },
  bottomButtonMessage: {
    id: 'vmst.cjs.application:conclusion.bottomButtonMessage',
    defaultMessage:
      'Á mínum síðum og í appi ísland.is getur þú nú nálgast staðfestingu á því að þessi aðgerð hafi verið framkvæmd.',
    description: 'Bottom info message',
  },
  bottomButtonLabel: {
    id: 'vmst.cjs.application:conclusion.bottomButtonLabel',
    defaultMessage: 'Opna Mínar síður',
    description: 'Bottom button label on completed form',
  },
  bottomButtonLink: {
    id: 'vmst.cjs.application:conclusion.bottomButtonLink',
    defaultMessage: '/minarsidur/umsoknir',
    description: 'Bottom button link on completed form',
  },
})
