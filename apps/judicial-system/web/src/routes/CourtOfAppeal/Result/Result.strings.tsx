import { defineMessages } from 'react-intl'

export const result = defineMessages({
  nextButtonText: {
    id: 'judicial.system.core:court_of_appeal.result.next_button_text',
    defaultMessage: 'Leiðrétta úrskurð',
    description:
      'Notaður sem texti í "Næsta" hnapp í úrskurðarferli héraðsdóms',
  },
  rulingModifiedTitle: {
    id: 'judicial.system.core:court_of_appeal.result.ruling_modified_title',
    defaultMessage: 'Úrskurður leiðréttur',
    description:
      'Notaður sem titill í "Úrskurður leiðréttur" hlutanum í úrskurðarferli héraðsdóms',
  },
  requestAppealRulingNotToBePublished: {
    id: 'judicial.system.core:result.request_appeal_ruling_not_to_be_published',
    defaultMessage:
      'Þess er óskað að birtingu úrskurðar á vef Landsréttar verði frestað',
    description:
      'Texti í svæði sem segir til um hvort óskað sé eftir að birtingu úrskurðar á vef Landsréttar verði frestað',
  },
})
