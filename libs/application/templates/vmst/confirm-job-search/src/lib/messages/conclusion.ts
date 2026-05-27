import { defineMessages } from 'react-intl'

export const conclusion = defineMessages({
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
      'Á mínum síðum og í appi getur þú nú nálgast margvíslegar upplýsingar um stöðu þína varðandi atvinnuleysisbæturnar.',
    description: 'Bottom info message',
  },
})
