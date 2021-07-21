import { defineMessages } from 'react-intl'

export const workMachine = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:general.sectionTitle',
      defaultMessage: 'Vinnuvél',
      description: 'Machinery',
    },
    subSectionTitle: {
      id: 'an.application:general.subSectionTitle',
      defaultMessage: 'Nánari gögn um vinnuvél',
      description: 'Further data on the machinery',
    },
    workMachineRadioTitle: {
      id: 'an.application:general.workMachineRadioTitle',
      defaultMessage: 'Tengist slys notkun vinnuvélar ?',
      description: 'Does the accident relate to use of machinery?',
    },
  }),
  labels: defineMessages({
    registrationNumber: {
      id: 'an.application:labels.registrationNumber',
      defaultMessage: 'Númer vinnuvélar',
      description: 'Registration number of machine',
    },
    desriptionOfMachine: {
      id: 'an.application:labels.desriptionOfMachine',
      defaultMessage: 'Aðrar upplýsingar um vinnuvél',
      description: 'Desription of machine',
    },
  }),
  placeholder: defineMessages({
    desriptionOfMachine: {
      id: 'an.application:placeholder.desriptionOfMachine',
      defaultMessage: 'Heiti á vinnuvél',
      description: 'Desription of machine',
    },
  }),
}
