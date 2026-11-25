export const courtRecordAccordion = {
  title: 'Þingbók',
  sections: {
    timeAndLocation: {
      title: 'Staður og tími',
      text: 'Þinghald frá {courtStartDate} kl. {courtStartTime} til {courtEndDate} kl. {courtEndTime} {courtLocation}.',
      textOngoing:
        'Þinghald frá kl. {courtStartTime}. Þinghaldi er ekki lokið.',
      textSameDay:
        'Þinghald frá {courtStartDate} kl. {courtStartTime} til {courtEndTime} {courtLocation}.',
    },
    courtAttendees: {
      title: 'Mættir eru',
    },
    courtDocuments: {
      title: 'Lagt er fram',
      text: '{documentName} þingmerkt nr. {documentNumber}{submittedBy, select, DEFENDER { lagt fram af varnaraðila} PROSECUTOR { lagt fram af sækjanda} DISTRICT_COURT_JUDGE { lagt fram af dómnum} other {}}.',
    },
    firstCourtDocument:
      'Krafa um {caseType} þingmerkt nr. 1. Rannsóknargögn málsins liggja frammi.',
    conclusion: {
      disclaimer: 'Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.',
    },
    sessionBookings: {
      title: 'Bókanir fyrir úrskurð',
    },
    appealDecision: {
      disclaimer:
        'Dómari kynnir varnaraðila rétt til að kæra úrskurð og um kærufrest, sbr. 193. gr. laga nr. 88/2008.',
    },
    endOfSessionBookings: {
      title: 'Bókanir í lok þinghalds',
    },
  },
}
