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
    conclusion: defineMessages({
      disclaimer: {
        id: 'judicial.system.core:court_record_accordion.conclusion.disclaimer',
        defaultMessage:
          'Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.',
        description:
          'Notaður sem texti undir "Úrskurðarorð" hlutanum í þingbókarfellilistanum.',
      },
    }),
    accusedPleaAnnouncement: defineMessages({
      title: {
        id:
          'judicial.system.core:court_record_accordion.accused_plea_announcement.title',
        defaultMessage: 'Bókanir um {accusedType}',
        description:
          'Notaður sem titill fyrir "Bókarnir um ..." hlutann í þingbókarfellilistanum.',
      },
    }),
    appealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.core:court_record_accordion.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum í þingbókarfellilistanum.',
      },
    }),
  },
}
