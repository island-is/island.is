import { defineMessage, defineMessages } from 'react-intl'

export const courtRecordAccordion = {
  title: defineMessage({
    id: 'judicial.system.core:court_record_accordion.title',
    defaultMessage: 'Þingbók',
    description: 'Notaður sem titill fyrir Þingbókarfellilistann',
  }),
  sections: {
    timeAndLocation: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.time_and_location.title',
        defaultMessage: 'Staður og tími',
        description:
          'Notaður sem titill í "tíma og stað" svæði í þingbókarfellilistanum.',
      },
      text: {
        id: 'judicial.system.core:court_record_accordion.time_and_location.text_v2',
        defaultMessage:
          'Þinghald frá {courtStartDate} kl. {courtStartTime} til {courtEndDate} kl. {courtEndTime} {courtLocation}.',
        description:
          'Notaður sem texti í "tíma og stað" svæði í þingbókarfellilistanum.',
      },
      textOngoing: {
        id: 'judicial.system.core:court_record_accordion.time_and_location.text_ongoing',
        defaultMessage:
          'Þinghald frá kl. {courtStartTime}. Þinghaldi er ekki lokið.',
        description:
          'Notaður sem texti í "tíma og stað" svæði í þingbókarfellilistanum þegar þinghald er enn í gangi.',
      },
      textSameDay: {
        id: 'judicial.system.core:court_record_accordion.time_and_location.text_same_day',
        defaultMessage:
          'Þinghald frá {courtStartDate} kl. {courtStartTime} til {courtEndTime} {courtLocation}.',
        description:
          'Notaður sem texti í "tíma og stað" svæði í þingbókarfellilistanum þegar þinghald byrjar og lýkur á sama degi.',
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
      text: {
        id: 'judicial.system.core:court_record_accordion.court_documents.text_v2',
        defaultMessage:
          '{documentName} þingmerkt nr. {documentNumber}{submittedBy, select, DEFENDER { lagt fram af varnaraðila} PROSECUTOR { lagt fram af sækjanda} DISTRICT_COURT_JUDGE { lagt fram af dómnum} other {}}.',
      },
    }),
    firstCourtDocument: defineMessage({
      id: 'judicial.system.core:court_record_accordion.firstCourtDocument',
      defaultMessage:
        'Krafa um {caseType} þingmerkt nr. 1. Rannsóknargögn málsins liggja frammi.',
      dscription:
        'Notaður sem texti fyrir fyrsta skjal þar sem þingskjöl eru upptalinn',
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
    sessionBookings: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.session_bookings.title',
        defaultMessage: 'Bókanir fyrir úrskurð',
        description:
          'Notaður sem titill fyrir "Bókarnir fyrir úrskurð" hlutann í þingbókarfellilistanum.',
      },
    }),
    appealDecision: defineMessages({
      disclaimer: {
        id: 'judicial.system.core:court_record_accordion.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum í þingbókarfellilistanum.',
      },
    }),
    endOfSessionBookings: defineMessages({
      title: {
        id: 'judicial.system.core:court_record_accordion.end_of_session_bookings.title',
        defaultMessage: 'Bókanir í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Bókanir í lok þinghalds" hlutann í þingbókarfellilistanum.',
      },
    }),
  },
}
