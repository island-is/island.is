import { defineMessages } from 'react-intl'

export const courtRecordAccordion = {
  sections: {
    timeAndLocation: defineMessages({
      title: {
        id:
          'judicial.system.core:court_record_accordion.time_and_location.title',
        defaultMessage: 'Staður og tími',
        description:
          'Notaður sem titill í "tíma og stað" svæði í þingbókarfellilistanum.',
      },
      text: {
        id:
          'judicial.system.core:court_record_accordion.time_and_location.text',
        defaultMessage:
          'Þinghald frá kl. {courtStartTime} til kl. {courtEndTime} {courtEndDate} {courtLocation}.',
        description:
          'Notaður sem texti í "tíma og stað" svæði í þingbókarfellilistanum.',
      },
      textOngoing: {
        id:
          'judicial.system.core:court_record_accordion.time_and_location.text_ongoing',
        defaultMessage:
          'Þinghald frá kl. {courtStartTime}. Þinghaldi er ekki lokið.',
        description:
          'Notaður sem texti í "tíma og stað" svæði í þingbókarfellilistanum þegar þinghald er enn í gangi.',
      },
    }),
    courtAttendees: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.court_attendees.title',
        defaultMessage: 'Mættir eru',
        description:
          'Notaður sem titill í "mættir eru" svæði í þingbókarfellilistanum.',
      },
    }),
    courtDocuments: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.court_documents.title',
        defaultMessage: 'Lagt er fram',
        description:
          'Notaður sem titill í "Lagt er fram" svæði í þingbókarfellilistanum.',
      },
    }),
    accusedRights: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.accused_rights.title',
        defaultMessage: 'Réttindi {accusedType}',
        description:
          'Notaður sem titill í "Réttindi ..." svæði í þingbókarfellilistanum.',
      },
      text: {
        id:
          'judicial.system.core:court_record_accordion.accused_rights.text-2#markdown',
        defaultMessage:
          'Sakborning er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborning er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.\\n\\n{genderedAccused} er kynnt krafa á dómskjali nr. 1.',
        description:
          'Notaður sem texti í "Réttindi ..." svæði í þingbókarfellilistanum.',
      },
    }),
  },
}
