import { defineMessages } from 'react-intl'

export const workMachine = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:general.sectionTitle',
      defaultMessage: 'Notkun Vinnuvélar',
      description: 'Machinery',
    },
    subSectionTitle: {
      id: 'an.application:general.subSectionTitle',
      defaultMessage: 'Upplýsingar um vinnuvél',
      description: 'Information on the machinery',
    },
    workMachineRadioTitle: {
      id: 'an.application:general.workMachineRadioTitle',
      defaultMessage: 'Tengist slys notkun vinnuvélar ?',
      description: 'Does the accident relate to use of machinery?',
    },
  }),
  labels: defineMessages({
    desriptionOfMachine: {
      id: 'an.application:labels.desriptionOfMachine',
      defaultMessage: 'Upplýsingar um vinnuvél',
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
