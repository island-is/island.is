import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.cases_for_review.title',
    defaultMessage: 'Mál til yfirlestrar',
    description: 'Titill á málum sem eru til yfirlestrar',
  },
  infoContainerTitle: {
    id: 'judicial.system.core:public_prosecutor.cases_for_review.info_container_title',
    defaultMessage: 'Engin mál til yfirlestrar.',
    description:
      'Titill á upplýsingasvæði sem segir að engin mál séu til yfirlestrar',
  },
  infoContainerMessage: {
    id: 'judicial.system.core:public_prosecutor.cases_for_review.info_container_message',
    defaultMessage: 'Engin mál fundust til yfirlestrar.',
    description: 'Texti sem segir að engin mál séu til yfirlestrar',
  },
})
