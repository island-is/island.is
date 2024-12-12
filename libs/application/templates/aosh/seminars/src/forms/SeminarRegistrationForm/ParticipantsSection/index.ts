import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildLinkField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'

import { participants as participantMessages } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import { Application } from '@island.is/api/schema'

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
        buildDescriptionField({
          id: '',
          title: participantMessages.labels.csvDescription,
          titleVariant: 'h5',
          marginTop: 2,
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
