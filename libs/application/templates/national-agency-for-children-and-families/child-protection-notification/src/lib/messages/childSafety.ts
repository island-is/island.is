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
      'Tilkynning til barnaverndar felur ekki sjálfkrafa í sér að opnað verði barnaverndarmál. Barnavernd tekur samt allar tilkynningar alvarlega, tekur þær til skoðunar, bregst við og virkjar viðeigandi fagaðila eða úrræði til stuðnings foreldri og barni eftir því sem við á. Við biðjum þig hér að veita okkur upplýsingar sem hjálpa okkur að ákvarða viðeigandi viðbrögð í framhaldi af þessari tilkynningu.',
    description: 'Child safety section description',
  },
  sliderQuestion: {
    id: 'cpn.application:childSafety.sliderQuestion',
    defaultMessage: 'Hversu öruggt telur þú barnið vera núna?',
    description: 'Child safety slider question',
  },
  sliderQuestionUnborn: {
    id: 'cpn.application:childSafety.sliderQuestionUnborn',
    defaultMessage:
      'Hversu öruggt telur þú verðandi foreldri og ófætt barn vera núna?',
    description: 'Child safety slider question for unborn child',
  },
  warningText: {
    id: 'cpn.application:childSafety.warningText#markdown',
    defaultMessage: 'Ef barnið er í bráðri hættu, hringdu í **112**',
    description: 'Warning text for child safety section',
  },
})
