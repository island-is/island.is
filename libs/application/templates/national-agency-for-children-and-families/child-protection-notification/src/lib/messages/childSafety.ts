import { defineMessages } from 'react-intl'

export const childSafetyMessages = defineMessages({
  sectionTitle: {
    id: 'cpn.application:childSafety.sectionTitle',
    defaultMessage: 'Öryggi barns',
    description: 'Child safety section title',
  },
  description: {
    id: 'cpn.application:childSafety.description',
    defaultMessage:
      'Smelltu á þá tölu sem lýsir best þínu mati. \n\n0 merkir að líf barns eða öryggi þess er í hættu og 10 merkir að barnið virðist öruggt núna. \n\nFaglegt mat á öryggi barns er ávallt hlutverk barnaverndarstarfsmanns.',
    description: 'Child safety section description',
  },
  sliderQuestion: {
    id: 'cpn.application:childSafety.sliderQuestion',
    defaultMessage:
      'Hversu öruggt eða óöruggt telur þjónustuveitandi barnið vera núna?',
    description: 'Child safety slider question',
  },
  sliderQuestionUnborn: {
    id: 'cpn.application:childSafety.sliderQuestionUnborn',
    defaultMessage:
      'Hversu öruggt eða óöruggt telur þjónustuveitandi ófædda barnið vera núna?',
    description: 'Child safety slider question for unborn child',
  },
  warningText: {
    id: 'cpn.application:childSafety.warningText#markdown',
    defaultMessage: 'Ef barnið er í bráðri hættu, hringdu í **112**',
    description: 'Warning text for child safety section',
  },
})
