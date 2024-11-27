import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'

import { participants as participantMessages } from '../../../lib/messages'

export const participantsSection = buildSection({
  id: 'participants',
  title: participantMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantsMultiField',
      title: participantMessages.general.pageTitle,
      description: participantMessages.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'participantList',
          title: 'test',
          //maxRows eina leiðin til að koma í veg fyrir "bæta við" takka, bæta við prop eða?
          fields: {
            name: {
              component: 'input',
              label: 'Nafn',
              width: 'full',
            },
            ssn: {
              component: 'input',
              label: 'Kennitala',
              width: 'half',
            },
          },
        }),
        buildCustomField({
          id: 'participantCSV',
          title: 'prufa',
          component: 'Participants',
        }),
      ],
    }),
  ],
})
