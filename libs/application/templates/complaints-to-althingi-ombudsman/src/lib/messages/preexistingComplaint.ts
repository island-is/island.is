import { defineMessages } from 'react-intl'

export const preexistingComplaint = {
  general: defineMessages({
    sectionTitle: {
      id: `ctao.application:general.preexistingComplaint.sectionTitle`,
      defaultMessage: 'Lagt fyrir dómstóla',
      description: 'Filed in court',
    },
    title: {
      id: `ctao.application:general.preexistingComplaint.title`,
      defaultMessage: 'Lagt fyrir dómstóla',
      description: 'Filed in court',
    },
    description: {
      id: `ctao.application:general.preexistingComplaint.description`,
      defaultMessage:
        'Hefur þú kvartað yfir þeim ákvörðunum eða öðru því sem lýst er hér að framan, t.d. með kæru eða öðru málskoti til annars stjórnvalds?',
      description:
        'Have there been previous complaints about the decisions or other things described above, e.g. with a complaint or other appeal to another authority?',
    },
  }),
  alertMessage: defineMessages({
    title: {
      id: `ctao.application:alertMessage.preexistingComplaint.title`,
      defaultMessage: 'Athugið',
      description: 'Notice',
    },
    description: {
      id: `ctao.application:alertMessage.preexistingComplaint.description`,
      defaultMessage:
        'Ef málinu var skotið til annars stjórnvalds, t.d. úrskurðarnefndar eða ráðuneytis, verður niðurstaða þess að liggja fyrir áður en umboðsmaður getur tekið kvörtun til meðferðar. Ef niðurstaða liggur fyrir er þess óskað að afrit af henni fylgi kvörtuninni.',
      description:
        'If a case can be referred to a higher authority, it is not possible to complain to the Ombudsman until a higher authority has given its ruling in the case.',
    },
  }),
  alternativeAlertMessage: defineMessages({
    title: {
      id: `ctao.application:alternativeAlertMessage.preexistingComplaint.title`,
      defaultMessage: 'Athugið',
      description: 'Notice',
    },
    description: {
      id: `ctao.application:alternativeAlertMessage.preexistingComplaint.description`,
      defaultMessage:
        'Til þess að umboðsmaður geti tekið kvörtun til meðferðar verða kæruleiðir innan stjórnsýslunnar að hafa verið nýttar og niðurstaða að liggja fyrir. Stjórnvöld leiðbeina oft um kæruleiðir í niðurlagi ákvarðana sinna.',
      description:
        'Prior to submitting this complaint to the Ombudsman, all other appeal options must be exhausted. Higher authorities specify the appeal process in their rulings.',
    },
  }),
}
