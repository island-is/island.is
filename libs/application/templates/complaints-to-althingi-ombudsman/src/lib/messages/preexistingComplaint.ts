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
        'Hefur áður verið kvartað yfir þeim ákvörðunum eða öðru því sem lýst er hér að framan, t.d. með kæru eða öðru málskoti til annars stjórnvalds?',
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
        'Ef skjóta má máli til æðra stjórnvalds er ekki unnt að kvarta til umboðsmanns fyrr en æðra stjórnvald hefur fellt úrskurð sinn í málinu.',
      description:
        'If a case can be referred to a higher authority, it is not possible to complain to the Ombudsman until a higher authority has given its ruling in the case.',
    },
  }),
}
