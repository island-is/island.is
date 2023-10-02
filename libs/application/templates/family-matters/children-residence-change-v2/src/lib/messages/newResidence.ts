import { defineMessages } from 'react-intl'

// New Legal Residence
export const newResidence = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.newResidence.sectionTitle',
      defaultMessage: 'Nýtt lögheimili',
      description: 'New legal residence section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.newResidence.pageTitle',
      defaultMessage: 'Hvert á að flytja lögheimilið?',
      description: 'New legal residence page title',
    },
    description: {
      id: 'crc.application:section.arrangement.newResidence.description#markdown',
      defaultMessage:
        'Sem foreldrar með sameiginlega forsjá getið þið óskað eftir því að lögheimili barns færist frá þér til hins foreldrisins, eða öfugt.\\n\\nVinsamlegast staðfestu að lögheimilisflutningur sé eins og fram kemur hér fyrir neðan:',
      description: 'New legal residence page description',
    },
  }),
  information: defineMessages({
    currentResidenceLabel: {
      id: 'crc.application:section.arrangement.newResidence.information.currentResidenceLabel',
      defaultMessage: 'Núverandi lögheimili barna:',
      description: 'Label for current residence',
    },
    newResidenceLabel: {
      id: 'crc.application:section.arrangement.newResidence.information.newResidenceLabel',
      defaultMessage: 'Nýtt lögheimili barna:',
      description: 'Label for new residence',
    },
  }),
}
