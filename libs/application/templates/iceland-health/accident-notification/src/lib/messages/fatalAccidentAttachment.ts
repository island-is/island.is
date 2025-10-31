import { defineMessages } from 'react-intl'

export const fatalAccidentAttachment = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:fatalAccidentAttachment.general.sectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    sectionDescription: {
      id: 'an.application:fatalAccidentAttachment.general.sectionDescription',
      defaultMessage:
        'Þegar um banaslys er að ræða er nauðsynlegt að skila inn lögregluskýrslu svo að Sjúkratryggingar Ísland getur unnið úr umsókn.',
      description:
        'In the case of a fatal accident, it is necessary to submit a police report so that Sjúkratryggingar Ísland can process the application.',
    },
  }),
  labels: defineMessages({
    title: {
      id: 'an.application:fatalAccidentAttachment.general.sectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    description: {
      id: 'an.application:fatalAccidentAttachment.general.sectionDescription',
      defaultMessage:
        'Þegar um banaslys er að ræða er nauðsynlegt að skila inn lögregluskýrslu svo að Sjúkratryggingar Ísland getur unnið úr umsókn.',
      description:
        'In the case of a fatal accident, it is necessary to submit a police report so that Sjúkratryggingar Ísland can process the application.',
    },
  }),
  options: defineMessages({
    addAttachmentsNow: {
      id: 'an.application:fatalAccidentAttachment.labels.addAttachmentsNow',
      defaultMessage: 'Ég er með nauðsynleg gögn og vil hlaða því upp núna',
      description: 'I have the necessary data and want to upload it now',
    },
    addAttachmentsLater: {
      id: 'an.application:fatalAccidentAttachment.labels.addAttachmentsLater',
      defaultMessage:
        'Ég vil klára að tilkynna slys en skila inn gögnum síðar ',
      description:
        'I want to finish reporting the accident but submit the data later',
    },
  }),
}
