import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'

import { participants as participantMessages } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'

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
            nationalId: {
              component: 'input',
              label: 'Kennitala',
              width: 'half',
            },
            email: {
              component: 'input',
              label: 'Netfang',
              width: 'half',
            },
            phoneNumber: {
              component: 'input',
              label: 'Símanúmer',
              width: 'half',
            },
          },
        }),
        buildCustomField({
          id: 'participantCSV',
          title: 'prufa',
          doesNotRequireAnswer: true,
          component: 'Participants',
        }),
        buildAlertMessageField({
          id: 'participantList.error',
          title: '',
          message: participantMessages.labels.csvError,
          alertType: 'error',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath(
              answers,
              'participantCsvError',
              false,
            ) as boolean
            return hasError
          },
        }),
      ],
    }),
  ],
})
