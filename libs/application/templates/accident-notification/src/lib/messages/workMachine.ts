import { defineMessages } from 'react-intl'

export const workMachine = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:workMachine.general.sectionTitle',
      defaultMessage: 'Notkun Vinnuvélar',
      description: 'Machinery',
    },
    subSectionTitle: {
      id: 'an.application:workMachine.general.subSectionTitle',
      defaultMessage: 'Upplýsingar um vinnuvél',
      description: 'Information on the machinery',
    },
    workMachineRadioTitle: {
      id: 'an.application:workMachine.general.workMachineRadioTitle',
      defaultMessage: 'Tengist slysið notkun á vinnuvél?',
      description: 'Does the accident relate to use of machinery?',
    },
  }),
  labels: defineMessages({
    desriptionOfMachine: {
      id: 'an.application:workMachine.labels.desriptionOfMachine',
      defaultMessage: 'Upplýsingar um vinnuvél',
      description: 'Desription of machine',
    },
  }),
  placeholder: defineMessages({
    desriptionOfMachine: {
      id: 'an.application:workMachine.placeholder.desriptionOfMachine',
      defaultMessage: 'Heiti á vinnuvél, og vinnuvélanúmer ef þekkt',
      description: 'Desription of machine',
    },
  }),
}
