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
          title: '',
          addItemButtonText:
            participantMessages.labels.addParticipantButtonText,
          fields: {
            name: {
              component: 'input',
              label: participantMessages.labels.name,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: participantMessages.labels.nationalId,
              width: 'half',
            },
            email: {
              component: 'input',
              label: participantMessages.labels.email,
              width: 'half',
            },
            phoneNumber: {
              component: 'input',
              label: participantMessages.labels.phoneNumber,
              width: 'half',
            },
          },
        }),
        buildAlertMessageField({
          id: 'participantList.validityError',
          title: '',
          message: participantMessages.labels.validityError,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath(
              answers,
              'participantValidityError',
              false,
            ) as boolean
            return hasError
          },
        }),
        buildCustomField({
          id: 'participantCSV',
          title: '',
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
