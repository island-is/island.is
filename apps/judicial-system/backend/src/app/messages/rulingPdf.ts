import { defineMessage, defineMessages } from '@formatjs/intl'

export const ruling = {
  heading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.heading',
    defaultMessage: 'Þingbók og úrskurður',
    description: 'Notaður sem titill í þingbókar og úrskurðar PDF',
  }),
  intro: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.into',
    defaultMessage:
      'Þann {courtDate} heldur {judgeNameAndTitle} dómþing. Fyrir er tekið mál nr. {caseNumber}. Þinghald hefst kl. {startTime}.',
    description:
      'Notaður sem upphafstexti þingbókar þar sem {courtDate} er dagsetning þinghalds, {judgeNameAndTitle} er nafn og starfsheiti dómara, {caseNumber} er númer dómsmáls og {startTime} er upphafstími þinghalds. {courtDate}, {judgeNameAndTitle}, {caseNumber} og {startTime} er sjálfkrafa bætt við í kóða.',
  }),
  closedCourtAnnouncement: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.close_court_announcement',
    defaultMessage:
      'Þinghaldið er háð fyrir luktum dyrum sbr. f-lið 10. gr. laga um meðferð sakamála nr. 88/2008.',
    description: 'Notaður sem tilkynning um þinghald fyrir luktum dyrum.',
  }),
  attendeesHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.attendees_heading',
    defaultMessage: 'Mættir eru:',
    description: 'Notaður sem fyrirsögn á lista yfir viðstadda.',
  }),
  requestheading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.request_heading',
    defaultMessage: 'Krafa:',
    description: 'Notaður sem fyrirsögn á kröfu.',
  }),
  courtDocuments: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.heading',
      defaultMessage: 'Lagt er fram:',
      description: 'Notaður sem fyrirsögn á skjöl sem lögð eru fram.',
    },
    request: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.request',
      defaultMessage: 'Krafa um {caseTypes} þingmerkt nr. 1.',
      description:
        'Notaður sem heiti á þingmerktri kröfu þar sem {caseType} er tegund máls og er sjálfkrafa bætt við í kóða.',
    },
    announcement: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.announcement',
      defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
      description:
        'Notaður sem tilkynning um að rannsóknargögn málsins liggi frammi.',
    },
    other: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.other',
      defaultMessage: '{documentName} þingmerkt nr. {documentNumber}.',
      description:
        'Notaður sem heiti á öðrum þingmerktum skjölum þar sem {documentName} er nafn skjals og {documentNumber} er númer skjals og er sjálfkrafa bætt við í kóða.',
    },
  }),
}
