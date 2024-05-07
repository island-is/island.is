import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.cases_awaiting_review.title',
    defaultMessage: 'Þín mál til yfirlestrar',
    description: 'Titill á þínum málum sem eru til yfirlestrar hjá þér',
  },
  infoContainerTitle: {
    id: 'judicial.system.core:public_prosecutor.cases_awaiting_review.info_container_title',
    defaultMessage: 'Engin mál til yfirlestrar.',
    description:
      'Titill á upplýsingasvæði sem segir að engin mál séu til yfirlestrar hjá þér',
  },
  infoContainerMessage: {
    id: 'judicial.system.core:public_prosecutor.cases_awaiting_review.info_container_message',
    defaultMessage: 'Engin mál fundust til yfirlestrar.',
    description: 'Texti sem segir að engin mál séu til yfirlestrar hjá þér',
  },
})
