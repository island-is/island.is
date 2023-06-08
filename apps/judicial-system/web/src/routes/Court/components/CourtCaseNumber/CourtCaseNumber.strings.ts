import { defineMessages } from 'react-intl'

export const courtCaseNumber = defineMessages({
  title: {
    id: 'judicial.system.core:court_case_number.title',
    defaultMessage: 'Málsnúmer héraðsdóms',
    description:
      'Notaður sem titill fyrir "Málsnúmer héraðsdóms" hlutann á yfirlits skrefi dómara í öllum málstegundum',
  },
  explanation: {
    id: 'judicial.system.core:court_case_number.explanation',
    defaultMessage:
      'Smelltu á hnappinn til að stofna nýtt mál eða skráðu inn málsnúmer sem er þegar til í Auði. Athugið að gögn verða sjálfkrafa vistuð á það málsnúmer sem slegið er inn.',
    description:
      'Notaður sem útskýringartexti fyrir "málsnúmer héraðsdóms" hlutann á yfirlits skrefi dómara í öllum málstegundum',
  },
  explanationDisabled: {
    id: 'judicial.system.core:court_case_number.explanation_disabled',
    defaultMessage:
      'Þessi krafa er enn í vinnslu hjá saksóknara. Hægt er að stofna nýtt mál eða tengja við mál í Auði um leið og gengið hefur verið frá kröfunni og hún send til dómstólsins.',
    description:
      'Notaður sem útskýringartexti fyrir "málsnúmer héraðsdóms" hlutann á yfirlits skrefi dómara í öllum málstegundum. Notað þegar ekki er hægt að stofna mál í Auði',
  },
  label: {
    id: 'judicial.system.core:court_case_number.label',
    defaultMessage: 'Mál nr.',
    description:
      'Notaður sem texti í "málsnúmer héraðsdóms" innnsláttarsvæði á yfirlits skrefi dómara í öllum málstegundum.',
  },
  placeholder: {
    id: 'judicial.system.core:court_case_number.placeholder_v1',
    defaultMessage: '{isIndictment, select, true {S} other {R}}-X/{year}',
    description:
      'Notaður sem skýritexti í "málsnúmer héraðsdóms" innsláttarsvæði á yfirlits skrefi dómara í öllum málstegundum.',
  },
  createCaseButtonText: {
    id: 'judicial.system.core:court_case_number.create_case_button_text',
    defaultMessage: 'Stofna nýtt mál',
    description:
      'Notaður sem texti á "Stofna nýtt mál" hnappi á yfirlits skrefi dómara í öllum málstegundum.',
  },
})
